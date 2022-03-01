import { Request, Response } from "express";
import { container } from "tsyringe";

import { Statement } from "../../entities/Statement";
import { OperationType } from "../../enums/OperationType";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    let statement: Statement;

    const splittedPath = request.originalUrl.split("/");
    const pathIndex = splittedPath.indexOf("statements") + 1;
    const type = splittedPath[pathIndex] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);
    const { amount, description } = request.body;

    if (type === "transfer") {
      const { id: sender_id } = request.user;
      const { user_id } = request.params;

      statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description,
        sender_id,
      });
    } else {
      const { id: user_id } = request.user;

      statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description,
      });
    }

    return response.status(201).json(statement);
  }
}
