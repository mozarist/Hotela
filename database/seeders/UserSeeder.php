<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the default Hotela administrator account.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@hotela.test'],
            [
                'name' => 'Hotela Administrator',
                'password' => 'password',
            ],
        );

        $admin->forceFill(['email_verified_at' => now()])->save();
        $admin->assignRole('admin');
    }
}
