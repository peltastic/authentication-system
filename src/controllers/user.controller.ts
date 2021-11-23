import _ from "lodash"
import {Request, Response} from "express";
import userService from "./../services/user.service";


class User {
    async createUser(req: Request, res: Response){
        const userCreated = await userService.createUser(req.body)

        res.send(_.omit(userCreated.toJSON(), "password"))
    }

    
}

export default new User()