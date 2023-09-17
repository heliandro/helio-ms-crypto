module.exports = async function () {
    const globalSetup = global as any;
    globalSetup.start = true;
};
