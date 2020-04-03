import * as bodyParser from 'body-parser';
import * as Bundler from 'parcel-bundler';
import { Server } from '@overnightjs/core';
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';

@Controller('api')
class ApiController {

    static readonly SORT_PARAM: string = "sort";
    static readonly FILTER_PARAM: string = "filter";
    static readonly DEATHS_THRESHOLD: number = 1000;
    static readonly CASES_TRESHOLD: number = 100000;

    static readonly COUNTRIES: string[] = [ 'Åland Islands', 'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Faroe Islands', 'Finland', 'France', 'Germany', 'Gibraltar', 'Greece', 'Guernsey', 'Holy See', 'Hungary', 'Iceland', 'Ireland', 'Isle of Man', 'Italy', 'Jersey', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Republic of Kosovo', 'Romania', 'Russian Federation', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Svalbard and Jan Mayen', 'Sweden', 'Switzerland', 'Ukraine', 'UK' ];
    
    @Get('/')
    private async api(req: Request, res: Response) {
        
        Logger.Info(`API request: ${JSON.stringify(req.query)}`);

        try {

            
            let response: AxiosResponse = await axios.get('https://coronavirus-19-api.herokuapp.com/countries');
            let data = response.data;

            const filter_param: string = req.query[ApiController.FILTER_PARAM];
            if(filter_param)
            {
                const filters = {
                    '100k_cases': (item) => item['cases'] > ApiController.CASES_TRESHOLD,
                    '1k_deaths': (item) => item['deaths'] > ApiController.DEATHS_THRESHOLD,
                    'europe': (item) => ApiController.COUNTRIES.includes(item['country']),
                };
                data = data.filter(filters[filter_param]);
            }
            
            const sort_param: string = req.query[ApiController.SORT_PARAM];
            if(sort_param)
            {
                data = _.sortBy(data, [sort_param]);

                if(req.query[ApiController.SORT_PARAM] !== 'country')
                {
                    data.reverse();
                }
            }
            
            return res.status(200).json({
                error: false,
                countries: data,
            });
        } catch (error) {
            Logger.Err(error);
            return res.status(500).json({
                error: true,
                countries: null,
            });
        }

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
