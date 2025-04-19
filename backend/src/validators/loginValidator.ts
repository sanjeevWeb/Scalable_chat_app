import Joi from "joi"


class LoginValidator {
    login = {
        body: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string(),
            provider: Joi.string(),
            oauth_id: Joi.string()
        })
            .xor("password", "provider") // Either password OR provider must be present
            .xor("password", "oauth_id") // Either password OR oauth_id must be present
            .with("provider", "oauth_id") // If provider is present, oauth_id must also be present
            .unknown(false) // No extra fields allowed
    }

    updateUser = {
        body: Joi.object({
            username: Joi.string(),
            password: Joi.string()
        })
        .min(1) // At least one of the fields (username or password) must be present
    }

    getUser = {
        query: Joi.object({
            userId: Joi.number().integer().positive(),
            username: Joi.string(),
            email: Joi.string().email()
        })
            .xor("userId", "username", "email") // Ensures only ONE of these fields is provided
            .required()
    };
}

export default new LoginValidator()