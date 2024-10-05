import pkg from './package.json' assert { type: "json" };

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import html from '@rollup/plugin-html'; // Importera HTML-plugin

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
                axios: 'axios' // Se till att axios är globalt
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
        html({ // Konfiguration för HTML-pluginet
            title: 'My App',
            fileName: 'index.html', // Namnet på HTML-filen
            meta: [
                { charset: 'UTF-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
            ],
            template: ({ title }) => `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>${title}</title>
              </head>
              <body>
                  <div id="root"></div>
                  <script src="/bundle.js"></script> <!-- Se till att detta matchar ditt utdata -->
              </body>
              </html>
            `
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env', '@babel/preset-react']
        }),
    ],
    external: ['react', 'react-dom', 'axios'] // Se till att React, ReactDOM och axios är externaliserade
};
