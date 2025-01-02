module.exports = (path, options) => {
    return options.defaultResolver(path, {
        ...options,
        packageFilter: pkg => {
            if (
                pkg.name === '@azure/core-util' ||
                pkg.name === '@azure/core-http' ||
                pkg.name === '@azure/communication-react' ||
                pkg.name === '@azure/abort-controller'||
                pkg.name === '@azure/core-rest-pipeline' ||
                pkg.name === '@azure/core-client' ||
                pkg.name === '@azure/core-auth' ||
                pkg.name === '@azure/logger' || 
                pkg.name === '@azure/core-tracing'||
                pkg.name === 'uuid' ||
                pkg.name === 'nanoid' ||
                pkg.name === '@fluentui/react'
            ) {
                delete pkg['exports'],
                delete pkg['module']
            }
            return pkg;
        }
    })
}