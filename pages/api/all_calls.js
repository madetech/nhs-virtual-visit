import pgp from 'pg-promise'

export default async (req, res) => {
    const uri = process.env.URI
    const ssl = {
        rejectUnauthorized: false
    }

    const db = pgp()({connectionString: uri, ssl});
    const post = await db.one('SELECT * FROM scheduled_calls_table');
}
