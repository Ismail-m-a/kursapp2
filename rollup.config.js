import pkg from './package.json' assert { type: "json" };

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.unpkg,
            format: 'umd',
            name: pkg.name.replace(/[^a-zA-Z0-9]/g, ''),
            exports: 'named',
            sourcemap: true,
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                axios: 'axios' // Add this line
            }
        }    
    ],
    plugins: [
        postcss({ extensions: ['.css'] }),
        nodePolyfills(),
        resolve({ extensions: ['.js', '.jsx'], dedupe: ['prop-types'] }),
        commonjs(),
        image(),
        terser(),
        json(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env', '@babel/preset-react']
        }),
    ],
    external: ['react', 'react-dom', 'axios'] // Ensure React and ReactDOM are externalized
};
