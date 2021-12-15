#!/usr/bin/env ts-node

/*
 * Copyright (c) 2021 ILEFA Labs
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import axios from 'axios';

import { version } from '../package.json';
import { ArgumentParser } from 'argparse';
import { getCurrentMode, Logger } from './util';
import { DeviceProvider, ProviderManager, UserProvider } from './provider';

if (!process.env.BLEWIT_TOKEN) {
    console.error('UConn API Token is not set. Please set the `BLEWIT_TOKEN` environment variable.');
    process.exit(1);
}

const parser = new ArgumentParser({
    description: `BlewIt by ILEFA Labs`,
});

parser.add_argument('-ver', '--version', { action: 'version', version });
parser.add_argument('-v', '--verbose', { action: 'store_true' });
parser.add_argument('-u', '--user', { action: 'store' });
parser.add_argument('-d', '--device', { action: 'store' });
parser.add_argument('-g', '--group', { action: 'store' });

axios.defaults.baseURL = 'https://its-api.uconn.edu';
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.BLEWIT_TOKEN}`;

const { verbose, user, device, group } = parser.parse_args();

const logger = new Logger();
const packed = Object.assign({}, { verbose, user, device, group });
const mode = getCurrentMode(user, device, group);
const manager = new ProviderManager();

axios
    .get('https://its-api.uconn.edu', { timeout: 1000 })
    .then(_ => verbose && logger.info('Net', 'Completed network self-test successfully.'))
    .catch(_ => {
        logger.severe('Net', 'Unable to connect to the API - please ensure you are connected to the UConn Network.');
        process.exit(1);
    });

verbose && console.table(packed);

manager.register(new DeviceProvider());
manager.register(new UserProvider());

if (mode === 'none') {
    parser.print_help();
    process.exit(1);
}

if (!mode) {
    console.error('Parameter overlap: supply either a user, device or group.');
    process.exit(1);
}

if (verbose) {
    logger.info('Env', 'Verbose logging enabled.');
    process.env.VERBOSE = "true";

    axios.interceptors.request.use(req => {
        logger.info(`Net`, `<- ${req.method.toUpperCase()} ${req.url}`);
        return req;
    });

    axios.interceptors.request.use(res => {
        logger.info(`Net`, `-> ${res.method.toUpperCase()} ${res.url}`);
        return res;
    });
}

const provider = manager.getProvider(mode);
if (!provider) {
    console.error(`\`${mode}\` does not have a provider registered.`);
    process.exit(1);
}

const input = packed[mode];
verbose && logger.info('Provider', `Using \`${mode}\` provider.`);

provider
    .get(input)
    .then(res => provider.report(input, res))
    .then(console.log)
    .catch(err => {
        logger.severe('Provider', 'Encountered an exception while processing your request:');
        logger.unlisted(err)
    });