import * as bodyParser from 'body-parser';
import * as Bundler from 'parcel-bundler';
import { Server } from '@overnightjs/core';
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import data from './example-data';

@Controller('api')
class ApiController {

  @Get('/')
  private async api(req: Request, res: Response) {
    Logger.Info(`API request: ${JSON.stringify(req.query)}`);
    return res.status(200).json({
      error: false,
      countries: data,
    });
  }
}

class AppServer extends Server {
  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    super.addControllers(new ApiController());
    const bundler = new Bundler('./index.html');
    this.app.use(bundler.middleware());
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp('Server started on port 3000');
    });
  }
}

const server = new AppServer();
server.start(3000);
