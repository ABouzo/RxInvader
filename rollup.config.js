import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

export default [
    {
        input: 'src/Main.ts',
        output: {
            file: 'dist/index.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                jsnext: true,
                browser: true,
                main: true,
                preferBuiltins: false,
            }),
            commonjs(),
            typescript({
                target: "ES5"
            }),
            // terser(),
        ],
    },
]
