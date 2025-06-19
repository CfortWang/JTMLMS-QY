module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 允许两种编码引入方式共存,也就是 common 规范与 es6 规范的共存处理
  sourceType: 'unambiguous'
}
// module.exports = {
//     presets: [
//         [
//             '@babel/preset-env',
//             {
//                 targets: '> 1%, last 2 versions, not dead', // 与 .browserslistrc 一致
//                 useBuiltIns: 'usage', // 按需引入 polyfill
//                 corejs: 3 // 使用 core-js 3
//             }
//         ]
//     ],
//     plugins: [
//         [
//             '@babel/plugin-transform-runtime',
//             {
//                 corejs: 3, // 使用 core-js 3
//                 version: '^7.16.10' // 与当前版本一致
//             }
//         ]
//     ]
// }
