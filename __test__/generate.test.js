const generate = require("../generate");
const removeProject = require("./utils");
const fs = require("fs");

describe("generate", () => {
  beforeAll(() => {
    jest.setTimeout(10000);
    return removeProject("test_project")
      .then(() => {
        return generate("test_project");
      })
      .then(() => {});
  });
  it("return true if the directory was created", (done) => {
    fs.access("./test_project", (err) => {
      expect(err).toBe(null);
      done();
    });
  });
  it("tests if the package.json was created", (done) => {
    fs.access("./test_project/package.json", (err) => {
      expect(err).toBe(null);
      done();
    });
  });
  it("generated controller, modeller", (done) => {
    fs.access("./test_project/controllers", (err) => {
      expect(err).toBe(null);
      done();
    });
  });
  it("generated app.js", (done) => {
    fs.access("./test_project/app.js", (err) => {
      expect(err).toBe(null);
      done();
    });
  });
  it("generated router", (done) => {
    fs.access("./test_project/routers", (err) => {
      expect(err).toBe(null);
      done();
    });
  });
});
