/* --------------- modules & plugins --------------------------- */

const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");

/* --------------- config -------------------------------------- */

const paths = {
    src: {
        abs: path.resolve(__dirname, "src"),
        rel: "src"
    },
    dist: {
        debug: {
            abs: path.resolve(__dirname, "dist/debug"),
            rel: "dist/debug"
        },
        release: {
            abs: path.resolve(__dirname, "dist/release"),
            rel: "dist/release"
        }
    },
    folders: {
        js: "js",
        style: "style",
        img: "img",
        html: "ejs",
        fonts: "fonts",
        components: "components"
    }
};

/* ---------------- module.exports ----------------------------- */

module.exports = (env = {}) => {

/* --------------- const --------------------------------------- */

    const {mode = "development"} = env;
    const isDev = mode === "development";
    const isProd = mode === "production";

/* --------------- functions ----------------------------------- */

    const getFilenameTemplate = (ext) => isProd ? `[name]-[hash:8].${ext}` : `[name].${ext}`;
    const fixSlashes = path => path.replace("\\","/");
    const getPlugins = () => {
        let plugins = [
            new CleanWebpackPlugin({
                // cleanStaleWebpackAssets: isProd // очищать неиспользуемое при ребилде?
            }),
            new htmlWebpackPlugin({
                inject: false,
                chunks: ["main"],
                template: fixSlashes(path.join(paths.folders.html, "index.ejs")),
                filename: "index.html",
                lang: "ru",
                meta: [
                    { charset: "utf-8" },
                    { content: "ie=edge", "http-equiv": "x-ua-compatible" },
                    { name: "description", content: "", lang: "ru" },
                    { name: "author", content: "Smarto" },
                    { name: "robots", content: isProd ? "index, follow" : "none" },
                    { name: "theme-color", content: "#0B3A72" }
                ],
                links: [
                    // blank favicon
                    {
                        rel: "icon",
                        href: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=",
                        type: "image/x-icon"
                    }
                ],
                headHtmlSnippet: `
                    <!--[if lt IE 9]>
                        <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/r29/html5.min.js"></script>
                    <![endif]-->
                `,
                title: "Анкета",
                mobile: true,
                buildDate: new Date().toString(),
                minify: isProd
            })
        ];

        if (isProd) {
            plugins.push(
                new MiniCSSExtractPlugin({
                    filename: fixSlashes(path.join(paths.folders.style, "main-[hash:8].css"))
                })
            );

            // Compress images
            plugins.push(
                new ImageminPlugin({
                    test: /\.(jpe?g|png|gif|svg|webp)$/i,
                    optipng: {
                        optimizationLevel: 6,
                    },
                    svgo: {
                        plugins: [ {
                            removeViewBox: false
                        }, {
                            convertStyleToAttrs: false
                        }]
                    },
                    plugins: [
                        imageminMozjpeg({
                            quality: 70,
                            progressive: true
                        })
                    ]
                })
            );
        }

        return plugins;
    }

    const cssLoaders = extra => {
        let loaders = [
            isProd ? MiniCSSExtractPlugin.loader : "style-loader",
            "css-loader",
            // {
            //     loader: 'resolve-url-loader',
            //     options: {
            //
            //     }
            // }
        ];

        // post css
        if (isProd) {
            loaders.push({
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [[
                            "postcss-preset-env",
                            { autoprefixer: {grid: "autoplace"} },
                            "postcss-object-fit-images"
                        ]],
                    },
                },
            });
        }

        // extra css
        if (extra) {
            if (typeof extra === "string") {
                loaders.push(extra);
            } else if (extra instanceof Array) {
                loaders = loaders.concat(extra);
            }
        }

        return loaders;
    }

/* --------------- return  ------------------------------------- */

    return {
        context: paths.src.abs,
        target: isProd ? "browserslist" : "web", // disable browserslist for development
        devtool: isProd ? undefined : "source-map",
        resolve: {
            extensions: [".js", ".jsx", ".json"],
            alias: {
                "@": paths.src.abs,
                "js": path.resolve(paths.src.abs, paths.folders.js),
                "style": path.resolve(paths.src.abs, paths.folders.style),
                "fonts": path.resolve(paths.src.abs, paths.folders.fonts),
                "img": path.resolve(paths.src.abs, paths.folders.img),
                "components": path.resolve(paths.src.abs, paths.folders.components)
            }
        },
        optimization: {
            splitChunks: {
                chunks: isProd ? "all" : "async"
            },
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                `...`,
                new CssMinimizerPlugin()
            ]
        },
        performance: {
            maxEntrypointSize: isProd ? 250000 : 1024*1024,
            maxAssetSize: isProd ? 250000 : 1024*1024
        },
        mode: isProd ? "production" : "development",
        devServer: {
            open: true,
            index: "",
            proxy: {
                "/api": {
                    target: "http://localhost:5001"
                },
                "/*/**": {
                    pathRewrite: function (path, req) {
                        const index = req.rawHeaders.findIndex(item => item === "Referer");
                        if (index === -1) return ""; // not found header
                        const u = req.rawHeaders[index + 1].replace(/\/[^\/]*$/, "");
                        const url = new URL(u);
                        const pathName = url.pathname;
                        return req.url.replace(pathName, "");
                    },
                    target: "http://localhost:4200",
                    changeOrigin: false
                }
            },
            publicPath: "/",
            historyApiFallback: true,
            port: 4200,
            overlay: {
                warnings: true,
                errors: true
            }
        },
        entry: {
            main: fixSlashes("./" + path.join(paths.folders.js, "index.js"))
        },
        output: {
            path: isProd ? paths.dist.release.abs : paths.dist.debug.abs,
            publicPath: "./",
            filename: fixSlashes(path.join(paths.folders.js, getFilenameTemplate("js")))
        },
        module: {
            rules: [
                // HTML
                {
                    test: /\.ejs$/i,
                    exclude: /node_modules/,
                    loader: 'ejs-loader',
                    options: {
                        esModule: false
                    }
                },

                // Loading images
                {
                    test: /\.(png|jpe?g|gif|ico)$/,
                    exclude: path.resolve(__dirname, paths.src.rel, paths.folders.fonts),
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: paths.folders.img,
                                name: getFilenameTemplate("[ext]"),
                                esModule: false,
                                publicPath: "/" + paths.folders.img
                            }
                        }
                    ]
                },

                // Loading SVG images
                {
                    test: /\.(svg)$/,
                    exclude: path.resolve(__dirname, paths.src.rel, paths.folders.fonts),
                    use: [ "babel-loader", "react-svg-loader" ]
                },

                // Loading fonts
                {
                    test: /fonts.*\.(ttf|otf|eot|woff2?|svg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[path][name].[ext]",
                                publicPath: isProd ? "../" : "",
                                esModule: false
                            }
                        }
                    ]
                },

                // Babel loader
                {
                    test: /\.jsx?$/,
                    use: "babel-loader"
                },

                // CSS loaders
                {
                    test: /\.(css)$/,
                    use: cssLoaders()
                },

                // SCSS loaders
                {
                    test: /\.(s[ca]ss)$/,
                    use: cssLoaders("sass-loader")
                }
            ]
        },
        plugins: getPlugins()
    };
}
