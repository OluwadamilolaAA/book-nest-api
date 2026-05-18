import crypto from "crypto";

const hashString = (value: string) => {
    return crypto.createHash("sha256").update(value).digest("hex");
};
export default hashString;