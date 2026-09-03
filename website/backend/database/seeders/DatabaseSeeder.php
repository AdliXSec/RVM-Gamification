<?php

namespace Database\Seeders;

use App\Models\Machine;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Admin Account ───────────────────────────────────────
        User::create([
            'name' => 'Admin RVM',
            'nim' => null,
            'email' => 'admin@rvm.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'character' => 'ninja.png',
            'points' => 0,
        ]);

        // ─── Officer Account ────────────────────────────────────
        User::create([
            'name' => 'Petugas RVM',
            'nim' => null,
            'email' => 'officer@rvm.test',
            'password' => Hash::make('password'),
            'role' => 'officer',
            'character' => 'ninja.png',
            'points' => 0,
        ]);

        // ─── Demo Student ──────────────────────────────────────
        User::create([
            'name' => 'Naufal Mahasiswa',
            'nim' => '2024001',
            'email' => 'naufal@student.test',
            'password' => Hash::make('password'),
            'role' => 'student',
            'character' => 'ninja.png',
            'points' => 750,
        ]);

        // ─── Machines ───────────────────────────────────────────
        Machine::create([
            'name' => 'RVM-01',
            'location' => 'Gedung A - Lantai 1',
            'max_capacity' => 250,
            'current_bottles' => 47,
            'status' => 'online',
        ]);

        $rvm2 = Machine::create([
            'name' => 'RVM-02',
            'location' => 'Gedung B - Kantin',
            'max_capacity' => 250,
            'current_bottles' => 210,
            'status' => 'online',
        ]);

        \App\Models\PickUpTicket::create([
            'ticket_code' => \App\Models\PickUpTicket::generateCode(),
            'machine_id' => $rvm2->id,
            'capacity_at_issue' => 210,
            'status' => 'pending',
        ]);

        // ─── Rewards Catalog ────────────────────────────────────
        Reward::create([
            'name' => 'Voucher Kantin 10K',
            'cost' => 1500,
            'description' => 'Voucher makan di kantin kampus senilai Rp10.000',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'Sticker Pack Eco-Warrior',
            'cost' => 500,
            'description' => 'Set stiker eksklusif bertema lingkungan',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'Tumbler RVM Edition',
            'cost' => 5000,
            'description' => 'Tumbler eksklusif limited edition dari RVM',
            'is_active' => true,
        ]);
    }
}
