module.exports = (path, options) => {
    return options.defaultResolver(path, {
        ...options,
        packageFilter: pkg => {
            if (
                pkg.name === '@azure/core-util' ||
                pkg.name === '@azure/core-http' ||
                pkg.name === '@azure/communication-react' ||
                pkg.name === '@azure/communication-common' ||
                pkg.name === '@azure/communication-calling' ||
                pkg.name === '@azure/communication-chat' ||
                pkg.name === '@azure/communication-identity' ||
                pkg.name === '@azure/abort-controller'||
                pkg.name === '@azure/core-rest-pipeline' ||
                pkg.name === '@azure/core-client' ||
                pkg.name === '@azure/core-auth' ||
                pkg.name === '@azure/logger' || 
                pkg.name === '@azure/core-tracing'||
                pkg.name === '@azure-rest/core-client' ||
                pkg.name === 'uuid' ||
                pkg.name === 'nanoid' ||
                pkg.name === '@fluentui/react'
            ) {
                delete pkg['exports'],
                delete pkg['module']
            }
            if (pkg.name === '@typespec/ts-http-runtime') {
                // Force to use CommonJS for this package but keep exports for subpath imports
                delete pkg['module'];
                delete pkg['browser'];
                if (pkg.exports) {
                    // Update all export mappings to prefer require/commonjs
                    Object.keys(pkg.exports).forEach(key => {
                        if (typeof pkg.exports[key] === 'object' && pkg.exports[key].require) {
                            pkg.exports[key] = pkg.exports[key].require;
                        }
                    });
                }
            }
            return pkg;
        }
    })
}