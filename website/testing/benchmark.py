#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════╗
║  RVM HOSTING BENCHMARK — DirectAdmin vs cPanel               ║
║  Stress test & performance comparison script                 ║
╚══════════════════════════════════════════════════════════════╝

Menguji:
  1. Latency (waktu respons rata-rata per request)
  2. Throughput (jumlah request/detik yang bisa di-handle)
  3. Concurrency (simulasi banyak user bersamaan)
  4. IoT Burst (simulasi mesin mengirim data terus-menerus)
  5. DNS Resolve Time
  6. TLS Handshake Time

Penggunaan:
  python3 benchmark.py
  python3 benchmark.py --concurrency 50 --requests 200
"""

import time
import statistics
import json
import argparse
import socket
import ssl
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
from datetime import datetime

try:
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
except ImportError:
    print("❌ Module 'requests' belum terinstall.")
    print("   Jalankan: pip install requests")
    sys.exit(1)

# ═══════════════════════════════════════════
# KONFIGURASI SERVER
# ═══════════════════════════════════════════

SERVERS = {
    "DirectAdmin (rvmapi.cu.ma)": {
        "base_url": "https://rvmapi.cu.ma/api/v1",
        "domain": "rvmapi.cu.ma",
    },
    "cPanel (rvm.phissimulation.my.id)": {
        "base_url": "https://rvm.phissimulation.my.id/api/v1",
        "domain": "rvm.phissimulation.my.id",
    },
}

# Endpoint publik yang tidak memerlukan autentikasi
TEST_ENDPOINTS = [
    {"method": "GET",  "path": "/notifications",   "label": "Notifikasi (Read)"},
    {"method": "GET",  "path": "/machines",         "label": "Mesin RVM (Read)"},
    {"method": "GET",  "path": "/rewards",          "label": "Rewards (Read)"},
    {"method": "GET",  "path": "/guides",           "label": "Panduan (Read)"},
    {"method": "GET",  "path": "/faqs",             "label": "FAQ (Read)"},
    {"method": "GET",  "path": "/settings",         "label": "Settings (Read)"},
]


def create_session():
    """Buat HTTP session dengan retry logic."""
    session = requests.Session()
    retries = Retry(total=2, backoff_factor=0.3, status_forcelist=[502, 503, 504])
    adapter = HTTPAdapter(max_retries=retries, pool_connections=50, pool_maxsize=50)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update({
        "Accept": "application/json",
        "User-Agent": "RVM-Benchmark/1.0",
    })
    return session


# ═══════════════════════════════════════════
# TEST 1: DNS RESOLVE TIME
# ═══════════════════════════════════════════

def test_dns_resolve(domain, attempts=5):
    """Ukur waktu DNS resolve."""
    times = []
    for _ in range(attempts):
        start = time.perf_counter()
        try:
            socket.getaddrinfo(domain, 443)
            elapsed = (time.perf_counter() - start) * 1000
            times.append(elapsed)
        except socket.gaierror:
            times.append(float('inf'))
    return times


# ═══════════════════════════════════════════
# TEST 2: TLS HANDSHAKE TIME
# ═══════════════════════════════════════════

def test_tls_handshake(domain, attempts=5):
    """Ukur waktu TLS handshake."""
    times = []
    for _ in range(attempts):
        try:
            sock = socket.create_connection((domain, 443), timeout=10)
            start = time.perf_counter()
            ctx = ssl.create_default_context()
            ssl_sock = ctx.wrap_socket(sock, server_hostname=domain)
            elapsed = (time.perf_counter() - start) * 1000
            times.append(elapsed)
            ssl_sock.close()
        except Exception:
            times.append(float('inf'))
    return times


# ═══════════════════════════════════════════
# TEST 3: SINGLE-REQUEST LATENCY
# ═══════════════════════════════════════════

def test_single_latency(session, base_url, endpoint, attempts=10):
    """Ukur latency per-request (ms)."""
    url = base_url + endpoint["path"]
    times = []
    status_codes = []
    for _ in range(attempts):
        try:
            start = time.perf_counter()
            resp = session.request(endpoint["method"], url, timeout=15)
            elapsed = (time.perf_counter() - start) * 1000
            times.append(elapsed)
            status_codes.append(resp.status_code)
        except Exception as e:
            times.append(float('inf'))
            status_codes.append(0)
    return times, status_codes


# ═══════════════════════════════════════════
# TEST 4: CONCURRENT THROUGHPUT
# ═══════════════════════════════════════════

def _single_request(session, url, method="GET"):
    """Helper untuk satu request dalam concurrency pool."""
    try:
        start = time.perf_counter()
        resp = session.request(method, url, timeout=15)
        elapsed = (time.perf_counter() - start) * 1000
        return {"time_ms": elapsed, "status": resp.status_code, "error": None}
    except Exception as e:
        return {"time_ms": None, "status": 0, "error": str(e)}


def test_concurrent(session, base_url, concurrency=20, total_requests=100):
    """Simulasi banyak user bersamaan."""
    url = base_url + "/notifications"  # Endpoint paling ringan
    results = []

    wall_start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = [pool.submit(_single_request, session, url) for _ in range(total_requests)]
        for f in as_completed(futures):
            results.append(f.result())
    wall_time = time.perf_counter() - wall_start

    success = [r for r in results if r["status"] == 200]
    fail = [r for r in results if r["status"] != 200]
    times = [r["time_ms"] for r in success if r["time_ms"] is not None]

    return {
        "total_requests": total_requests,
        "concurrency": concurrency,
        "wall_time_s": round(wall_time, 2),
        "rps": round(len(success) / wall_time, 2) if wall_time > 0 else 0,
        "success": len(success),
        "fail": len(fail),
        "avg_ms": round(statistics.mean(times), 2) if times else None,
        "median_ms": round(statistics.median(times), 2) if times else None,
        "p95_ms": round(sorted(times)[int(len(times) * 0.95)] if times else 0, 2),
        "p99_ms": round(sorted(times)[int(len(times) * 0.99)] if times else 0, 2),
        "min_ms": round(min(times), 2) if times else None,
        "max_ms": round(max(times), 2) if times else None,
    }


# ═══════════════════════════════════════════
# TEST 5: IoT BURST SIMULATION
# ═══════════════════════════════════════════

def test_iot_burst(session, base_url, burst_count=20):
    """Simulasi IoT RVM mengirim data berturut-turut (fire & forget)."""
    url = base_url + "/iot/deposit"
    results = []

    for i in range(burst_count):
        payload = {
            "name": "RVM-BENCHMARK",  # Mesin yang mungkin tidak ada
            "bottles": 1,
            "claim_code": f"BENCH-{int(time.time()*1000)}-{i}",
        }
        try:
            start = time.perf_counter()
            # Gunakan request baru (bukan session) untuk menghindari connection pool issues
            resp = requests.post(url, json=payload, timeout=15, headers={"Accept": "application/json"})
            elapsed = (time.perf_counter() - start) * 1000
            results.append({"time_ms": elapsed, "status": resp.status_code})
        except Exception as e:
            results.append({"time_ms": None, "status": 0, "error": str(e)})

    times = [r["time_ms"] for r in results if r["time_ms"] is not None]
    return {
        "burst_count": burst_count,
        "avg_ms": round(statistics.mean(times), 2) if times else None,
        "median_ms": round(statistics.median(times), 2) if times else None,
        "min_ms": round(min(times), 2) if times else None,
        "max_ms": round(max(times), 2) if times else None,
        "note": "Status 422 = expected (mesin benchmark tidak terdaftar)",
    }


# ═══════════════════════════════════════════
# DISPLAY HELPERS
# ═══════════════════════════════════════════

def fmt(val, suffix="ms"):
    if val is None or val == float('inf'):
        return "TIMEOUT"
    return f"{val:.1f}{suffix}"


def print_header(title):
    w = 62
    print(f"\n{'═' * w}")
    print(f"  {title}")
    print(f"{'═' * w}")


def print_comparison_bar(label, val_a, val_b, unit="ms"):
    """Cetak bar perbandingan visual."""
    max_bar = 30
    if val_a is None or val_b is None:
        print(f"  {label:<25} {'N/A':>10}  vs  {'N/A':>10}")
        return

    max_val = max(val_a, val_b, 0.001)
    bar_a = int((val_a / max_val) * max_bar)
    bar_b = int((val_b / max_val) * max_bar)

    winner = ""
    if val_a < val_b:
        pct = ((val_b - val_a) / val_b) * 100
        winner = f" ◀ DA {pct:.0f}% lebih cepat"
    elif val_b < val_a:
        pct = ((val_a - val_b) / val_a) * 100
        winner = f" ◀ cP {pct:.0f}% lebih cepat"

    print(f"  {label}")
    print(f"    DA  {'█' * bar_a}{'░' * (max_bar - bar_a)} {val_a:>8.1f} {unit}")
    print(f"    cP  {'█' * bar_b}{'░' * (max_bar - bar_b)} {val_b:>8.1f} {unit}{winner}")
    print()


# ═══════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="RVM Hosting Benchmark")
    parser.add_argument("--concurrency", type=int, default=20, help="Jumlah concurrent users (default: 20)")
    parser.add_argument("--requests", type=int, default=100, help="Total requests untuk concurrency test (default: 100)")
    parser.add_argument("--latency-samples", type=int, default=10, help="Jumlah sample per endpoint (default: 10)")
    parser.add_argument("--iot-burst", type=int, default=15, help="Jumlah IoT burst requests (default: 15)")
    args = parser.parse_args()

    print()
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║     🏎️  RVM HOSTING BENCHMARK — DirectAdmin vs cPanel       ║")
    print("╠══════════════════════════════════════════════════════════════╣")
    print(f"║  Waktu     : {datetime.now().strftime('%Y-%m-%d %H:%M:%S'):<46} ║")
    print(f"║  Concurrency : {args.concurrency:<44} ║")
    print(f"║  Requests  : {args.requests:<46} ║")
    print("╚══════════════════════════════════════════════════════════════╝")

    all_results = {}

    for name, cfg in SERVERS.items():
        session = create_session()
        print_header(f"Testing: {name}")
        server_result = {}

        # ─── DNS ───
        print("  ⏳ DNS Resolve...", end="", flush=True)
        dns_times = test_dns_resolve(cfg["domain"])
        dns_avg = statistics.mean([t for t in dns_times if t != float('inf')])
        print(f"  ✅ avg {fmt(dns_avg)}")
        server_result["dns_avg_ms"] = round(dns_avg, 2)

        # ─── TLS ───
        print("  ⏳ TLS Handshake...", end="", flush=True)
        tls_times = test_tls_handshake(cfg["domain"])
        tls_avg = statistics.mean([t for t in tls_times if t != float('inf')])
        print(f"  ✅ avg {fmt(tls_avg)}")
        server_result["tls_avg_ms"] = round(tls_avg, 2)

        # ─── Latency per endpoint ───
        print(f"  ⏳ Latency test ({args.latency_samples} samples x {len(TEST_ENDPOINTS)} endpoints)...")
        endpoint_results = {}
        for ep in TEST_ENDPOINTS:
            times, codes = test_single_latency(session, cfg["base_url"], ep, args.latency_samples)
            valid = [t for t in times if t != float('inf')]
            avg = statistics.mean(valid) if valid else None
            med = statistics.median(valid) if valid else None
            ok_count = sum(1 for c in codes if 200 <= c < 300)
            print(f"    {ep['label']:<25} avg={fmt(avg)}  median={fmt(med)}  ok={ok_count}/{args.latency_samples}")
            endpoint_results[ep["label"]] = {
                "avg_ms": round(avg, 2) if avg else None,
                "median_ms": round(med, 2) if med else None,
                "success_rate": f"{ok_count}/{args.latency_samples}",
            }
        server_result["endpoints"] = endpoint_results

        # Overall latency average
        all_avgs = [v["avg_ms"] for v in endpoint_results.values() if v["avg_ms"] is not None]
        server_result["overall_latency_avg_ms"] = round(statistics.mean(all_avgs), 2) if all_avgs else None

        # ─── Concurrency ───
        print(f"  ⏳ Concurrency test ({args.concurrency} workers, {args.requests} requests)...", flush=True)
        conc = test_concurrent(session, cfg["base_url"], args.concurrency, args.requests)
        print(f"    ✅ RPS={conc['rps']}  avg={fmt(conc['avg_ms'])}  p95={fmt(conc['p95_ms'])}  fail={conc['fail']}")
        server_result["concurrency"] = conc

        # ─── IoT Burst ───
        print(f"  ⏳ IoT Burst test ({args.iot_burst} sequential POST)...", flush=True)
        iot = test_iot_burst(session, cfg["base_url"], args.iot_burst)
        print(f"    ✅ avg={fmt(iot['avg_ms'])}  min={fmt(iot['min_ms'])}  max={fmt(iot['max_ms'])}")
        server_result["iot_burst"] = iot

        all_results[name] = server_result
        session.close()

    # ═══════════════════════════════════════
    # PERBANDINGAN VISUAL
    # ═══════════════════════════════════════

    da_key = "DirectAdmin (rvmapi.cu.ma)"
    cp_key = "cPanel (rvm.phissimulation.my.id)"
    da = all_results[da_key]
    cp = all_results[cp_key]

    print_header("📊 PERBANDINGAN LANGSUNG")

    print_comparison_bar("DNS Resolve", da["dns_avg_ms"], cp["dns_avg_ms"])
    print_comparison_bar("TLS Handshake", da["tls_avg_ms"], cp["tls_avg_ms"])
    print_comparison_bar("Overall Latency (avg)", da["overall_latency_avg_ms"], cp["overall_latency_avg_ms"])

    # Per-endpoint comparison
    print("  ─── Per-Endpoint Latency ───")
    for ep in TEST_ENDPOINTS:
        label = ep["label"]
        da_val = da["endpoints"].get(label, {}).get("avg_ms")
        cp_val = cp["endpoints"].get(label, {}).get("avg_ms")
        print_comparison_bar(f"  {label}", da_val, cp_val)

    print_comparison_bar("Concurrency Avg", da["concurrency"]["avg_ms"], cp["concurrency"]["avg_ms"])
    print_comparison_bar("Concurrency P95", da["concurrency"]["p95_ms"], cp["concurrency"]["p95_ms"])
    
    da_rps = da["concurrency"]["rps"]
    cp_rps = cp["concurrency"]["rps"]
    print_comparison_bar("Throughput (RPS)", da_rps, cp_rps, "req/s")

    print_comparison_bar("IoT Burst Avg", da["iot_burst"]["avg_ms"], cp["iot_burst"]["avg_ms"])

    # ═══════════════════════════════════════
    # VERDICT
    # ═══════════════════════════════════════

    print_header("🏆 VERDICT")

    scores = {"DA": 0, "cP": 0}
    comparisons = [
        ("DNS", da["dns_avg_ms"], cp["dns_avg_ms"]),
        ("TLS", da["tls_avg_ms"], cp["tls_avg_ms"]),
        ("Latency", da["overall_latency_avg_ms"], cp["overall_latency_avg_ms"]),
        ("Concurrency Avg", da["concurrency"]["avg_ms"], cp["concurrency"]["avg_ms"]),
        ("Concurrency P95", da["concurrency"]["p95_ms"], cp["concurrency"]["p95_ms"]),
        ("IoT Burst", da["iot_burst"]["avg_ms"], cp["iot_burst"]["avg_ms"]),
    ]

    # RPS: higher is better (reverse comparison)
    if da_rps and cp_rps:
        if da_rps > cp_rps:
            scores["DA"] += 1
        elif cp_rps > da_rps:
            scores["cP"] += 1

    for label, da_val, cp_val in comparisons:
        if da_val is not None and cp_val is not None:
            if da_val < cp_val:
                scores["DA"] += 1
            elif cp_val < da_val:
                scores["cP"] += 1

    print(f"  DirectAdmin  : {scores['DA']} poin")
    print(f"  cPanel       : {scores['cP']} poin")
    print()
    if scores["DA"] > scores["cP"]:
        print("  🥇 DirectAdmin (rvmapi.cu.ma) MENANG!")
    elif scores["cP"] > scores["DA"]:
        print("  🥇 cPanel (rvm.phissimulation.my.id) MENANG!")
    else:
        print("  🤝 SERI! Performanya setara.")

    # Capacity estimate
    print()
    print("  ─── Estimasi Kapasitas ───")
    for key in [da_key, cp_key]:
        rps = all_results[key]["concurrency"]["rps"]
        if rps:
            daily = rps * 86400
            print(f"  {key}:")
            print(f"    {rps} req/s → ~{int(daily):,} request/hari")
            print(f"    Estimasi user simultan: ~{int(rps * 5)} (dengan 1 req per 5 detik per user)")
        print()

    # Save to JSON
    output_file = "benchmark_result.json"
    with open(output_file, "w") as f:
        json.dump(all_results, f, indent=2, default=str)
    print(f"  📄 Detail lengkap disimpan di: {output_file}")
    print()


if __name__ == "__main__":
    main()
