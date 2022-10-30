import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            const ck = new Cookies(req, res);
            const {username, password} = JSON.parse(req.body);

            if (username === 'admin' && password === 'admin') {
                ck.set('auth', 'true');
                return res.status(200).send('OK');
            }
            return res.status(401).send('Unauthorized');

        default:
            return res.status(405).send('Method not allowed');
    }
}