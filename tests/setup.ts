beforeAll(async () => {
    jest.spyOn(console, "log").mockReturnValue()
    jest.spyOn(console, "error").mockReturnValue()
})