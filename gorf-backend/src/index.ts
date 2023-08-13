import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3001;
process.env.TZ = 'Canada/Eastern';

app.listen(port, () => console.log('ITS GO TIME ON PORT ' + port));
