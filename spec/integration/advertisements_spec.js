const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {

    beforeEach((done) => {
        this.advertisement;
        sequelize.sync({force: true}).then((res) => {

            Advertisement.create({
                title: "Advert 1",
                description: "Buy this now"
            })
            .then((advertisement) => {
                this.advertisement = advertisement;
                done();
            });

        });

    });

    describe("GET /advertisements", () => {

        it("should return a status code 200 and all advertisements", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Advertisements");
                expect(body).toContain("Advert 1");
                done();
            });
        });

    });


    describe("GET /advertisements/new", () => {

        it("should render a new advertisement form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Advertisement");
                done();
            });
        });

    });

    describe("POST /advertisements/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Trader Joe's",
            description: "Apples: 10 for $1"
          }
        };
  
        it("should create a new topic and redirect", (done) => {
  
  //#1
          request.post(options,
  
  //#2
            (err, res, body) => {
              Advertisement.findOne({where: {title: "Trader Joe's"}})
              .then((advertisement) => {
                expect(res.statusCode).toBe(303);
                expect(advertisement.title).toBe("Trader Joe's");
                expect(advertisement.description).toBe("Apples: 10 for $1");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
      });
});