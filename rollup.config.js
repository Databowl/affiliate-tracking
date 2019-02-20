import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonJS from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

import pkg from './package.json'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'DbEvtTracking',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        },
    ],
    plugins: [
        replace({
            ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
            'process.env.RECAPTCHA_SITE_KEY': "'" + process.env.RECAPTCHA_SITE_KEY + "'"
        }),
        resolve({
            browser: true,
            preferBuiltins: true
        }),
        commonJS(),
        globals(),
        builtins(),
        json(),
        typescript({
            typescript: require('typescript'),
            useTsconfigDeclarationDir: true
        }),
        sourcemaps(),
    ],
}