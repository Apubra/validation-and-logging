const express = require("express");
const joi = require("joi");
const bodyParser = require("body-parser");
const LogService = require("./services/log-service");
let log = LogService.createLogger("LoggingAndValidation");

const app = express();

app.use(LogService.expressLogger());
// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/logging_and_validation", (req, res) => {
    const schema = joi.object().keys({
        id: joi.number().integer().required(),
        name: joi.string().required(),
        birthday: joi.date().required(),
    });

    const validationResult = schema.validate(req.body, {
        abortEarly: false,
    });
    // console.log(validationResult);
    if (validationResult.error !== undefined) {
        const { details } = validationResult.error;
        const message = details.map((i) => i.message).join(",");
        log.error("[logging_and_validation] ", message);
        res.status(400).json({ msg: message });
    } else {
        res.status(200).json({ msg: "Your Data is Validated by Joi..." });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
