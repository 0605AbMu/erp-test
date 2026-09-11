import { Pool } from "pg";
import { parseArgs, ParseArgsOptionsConfig } from 'node:util';
import { emailRegex, passwordRegex } from "../src/common/utils/regex.util.js";
import { Roles } from "@erp-test/shared";
import { hashPassword } from "../src/common/utils/password.util.js";
import 'dotenv/config';

const parseOptions: ParseArgsOptionsConfig = {
    email: {type: 'string', multiple: false, short: 'e'},
    password: {type: 'string', multiple: false, short: 'p'},
}

export async function createSuperAdmin(pool: Pool): Promise<void> {

  const { values, positionals } = parseArgs({ options: parseOptions });

  const [email, password] = [values.email as string, values.password as string];

  if (!email || !password){
    console.error("USAGE: pnpm db:superadmin -e superadmin@gmail.com -p password");
    process.exit(1);
  }

    if(!email || !emailRegex.test(email as string)) {
      console.error('Invalid email format');
      process.exit(1);
    }
   
    if (!password || !passwordRegex.test(password as string)) {
      console.error('Invalid password format');
      console.error('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
      process.exit(1);
    }

    const user = await pool.query('SELECT id, is_active FROM users WHERE email = $1', [email.toString().toLowerCase()]);

    let userId = user.rows[0]?.id;
    let isActive = user.rows[0]?.is_active;
    let alreadyExists = false;

    try {
         //transaction required to ensure that the user and role assignment are atomic
         await pool.query('BEGIN');

        if (!userId) {
            userId = (await pool.query(
                'INSERT INTO users (name, surname, email, password_hash, is_active, created_by_id, updated_by_id) VALUES (\'SuperAdmin\', \'SuperAdmin\', $1, $2, true, NULL, NULL) RETURNING id',
                [email.toString().toLowerCase(), hashPassword(password)]
            )).rows[0]?.id;
            console.log('SuperAdmin user created successfully with email: ' + email);
        } else if (!isActive) {
            console.log('User exists but is not active. Activating user...');
            await pool.query('UPDATE users SET is_active = true WHERE id = $1', [userId]);
            console.log('User activated successfully');
        }

        const roleId = (await pool.query('SELECT id FROM roles WHERE name = $1', [Roles.ADMIN])).rows[0]?.id;

        const userRole = await pool.query('SELECT 1 FROM user_roles WHERE user_id = $1 and role_id = $2', [userId, roleId]);
        
        if (!userRole.rows[0]) {
            await pool.query('INSERT INTO user_roles (user_id, role_id, granted_by, granted_at) VALUES ($1, $2, $3, NOW())', [userId, roleId, userId]);
            console.log('Admin role assigned to SuperAdmin successfully');
        } else {
          console.log('SuperAdmin already has the Admin role assigned');
          alreadyExists = true;
        }

        await pool.query('COMMIT');

        if (alreadyExists) {
          console.log('SuperAdmin already exists for ' + email);
        } else {
          console.log('SuperAdmin created successfully for ' + email);
        }

    }
    catch (error) {
      console.error('Error creating super admin user:', error);
      await pool.query('ROLLBACK');
      process.exit(1);
    }
}

//run create super admin
(async () => {
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try{
  await createSuperAdmin(pool);
}
finally{
  await pool.end();
}
})()