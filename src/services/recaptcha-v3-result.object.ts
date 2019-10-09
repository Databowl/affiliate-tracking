export class RecaptchaV3ResultObject {
    public constructor(
        public score: number,
        public requireV2Recaptcha: boolean,
    ) {}
}