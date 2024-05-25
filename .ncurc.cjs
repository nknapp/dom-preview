const minorOnly = [
  {
    packages: ["eslint"],
    reason:
      "Breaking changes are not compatible with all dependencies (i.e. @typescript-eslint)",
  },
];

module.exports = {
  doctor: true,
  doctorInstall: "npm install",
  doctorTest: "npm run build-and-test",
  target(name) {
    if (minorOnly.flatMap((rule) => rule.packages).includes(name)) {
      return "minor";
    }
    return "latest";
  },
};
