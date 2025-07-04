import { prisma } from "../prisma";
import { ModuleSeeder } from "./module.seeder";
import { PermissionListSeeder } from "./permissionList.seeder";
import { PermissionModuleSeeder } from "./permissionModule.seeder";
import { PermissionsSeeder } from "./permissions.seeder";
import { RoleSeeder } from "./role.seeder";
import { UserSeeder } from "./user.seeder";
import { UserHasRoleSeeder } from "./userHasRole.seeder";

type Seeder = {
    seed: () => Promise<void>;
    constructor: { name: string }
};

async function seedDatabase() {
    const seeders: Seeder[] = [
        new PermissionListSeeder(),
        new ModuleSeeder(),
        new PermissionModuleSeeder(),
        new RoleSeeder(),
        new PermissionsSeeder(),
        new UserSeeder(),
        new UserHasRoleSeeder()
    ];

    try {
        console.log("🚀 Start seeding database...\n");

        for (const seeder of seeders) {
            console.log(`🔹 Running ${seeder.constructor.name}...`);
            await seeder.seed();
        }

        console.log("✅ Database seeded successfully!\n");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
