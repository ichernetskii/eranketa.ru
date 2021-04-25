module.exports = {
    apps: [{
        name: "eranketa.ru",
        script: "npm -- run server:prod",
        env: {
            NODE_ENV: "development"
        },
        env_production : {
            NODE_ENV: "production"
        },
        error_file: "err.log",
        out_file: "out.log",
        log_file: "combined.log",
        autorestart: true,
        watch: false,
        instance_var: "5001",
        append_env_to_name: true
        // watch: ["server/config", "server/middleware", "server/models", "server/routes", "server/app.js"],
        // ignore_watch: ["node_modules", "client"],
        // watch_delay: 1000
    }]
}
