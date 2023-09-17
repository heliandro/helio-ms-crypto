module.exports = async function () {
    const globalSetup = global as any;
    if (globalSetup.start) {
        console.log('jest teardown');
    }
};
