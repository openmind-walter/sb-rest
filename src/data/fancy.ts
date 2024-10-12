import { FancyEvent } from "src/model/fancy";

const mockfancList = [
    {
        "status": 200,
        "data": {
            "11652": "{\"id\":11652,\"name\":\"Match 1st Ball Run\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"1.00\",\"bs1\":\"130\",\"l1\":\"1.00\",\"ls1\":\"200\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
            "11653": "{\"id\":11653,\"name\":\"Match Only 1st Over\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"6.00\",\"bs1\":\"100\",\"l1\":\"5.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}"
        },
        "event_id": "30816332"
    },
    {
        "status": 200,
        "data": {
            "11654": "{\"id\":11654,\"name\":\"Match Only 2nd Over\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"8.00\",\"bs1\":\"100\",\"l1\":\"7.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
            "11655": "{\"id\":11655,\"name\":\"Match 1st Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"9.00\",\"bs1\":\"100\",\"l1\":\"8.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}"
        },
        "event_id": "30816333"
    },
    {
        "status": 200,
        "data": {
            "11656": "{\"id\":11656,\"name\":\"Match 2nd Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"12.00\",\"bs1\":\"100\",\"l1\":\"10.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
            "11657": "{\"id\":11657,\"name\":\"Match 3rd Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"15.00\",\"bs1\":\"100\",\"l1\":\"13.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}"
        },
        "event_id": "30816334"
    },
    {
        "status": 200,
        "data": {
            "11658": "{\"id\":11658,\"name\":\"Match 4th Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"18.00\",\"bs1\":\"100\",\"l1\":\"16.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
            "11659": "{\"id\":11659,\"name\":\"Match 5th Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"20.00\",\"bs1\":\"100\",\"l1\":\"19.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}"
        },
        "event_id": "30816335"
    },
    {
        "status": 200,
        "data": {
            "11660": "{\"id\":11660,\"name\":\"Match 6th Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"22.00\",\"bs1\":\"100\",\"l1\":\"21.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
            "11661": "{\"id\":11661,\"name\":\"Match 7th Six\",\"type_code\":34,\"odd_type\":\"RUNS\",\"priority\":1,\"bet_allow\":1,\"bet_delay\":0,\"min_bet\":100,\"max_bet\":100000,\"max_profit\":500000,\"b1\":\"25.00\",\"bs1\":\"100\",\"l1\":\"24.00\",\"ls1\":\"100\",\"b2\":\"0.00\",\"bs2\":\"0\",\"l2\":\"0.00\",\"ls2\":\"0\",\"b3\":\"0.00\",\"bs3\":\"0\",\"l3\":\"0.00\",\"ls3\":\"0\",\"status1\":\"SUSPENDED\",\"status2\":\"SUSPENDED\",\"status3\":\"SUSPENDED\",\"result\":null,\"is_active\":1,\"in_play\":1,\"auto_suspend_time\":\"2021-09-01 09:20:00\"}",
        },
        "event_id": "30816382"
    }
]



export function getMockFancies(): Promise<FancyEvent[]> {

    return new Promise(resolve => {
        setTimeout(() => {
            const result = [];
            mockfancList.forEach((response) => {
                const parsedData = Object.keys(response.data).map(key => JSON.parse(response.data[key]));

                result.push({
                    status: response.status,
                    event_id: response.event_id,
                    data: parsedData
                });
            });
            resolve(result);
        }, 100);
    });

}

export async function getMockFancy(eventId: string): Promise<FancyEvent | null> {
    const fancyevent = (await getMockFancies()).find(f => f.event_id === eventId) || null;

    if (fancyevent) {
        const getRandomNumber = (max: number) => (Math.random() * max).toFixed(1);
        const updatedData = Object.fromEntries(
            Object.entries(fancyevent.data).map(([key, runner]) => [
                key,
                {
                    ...runner,
                    b1: Number(runner.b1) + Number(getRandomNumber(10)),
                    bs1: Number(runner.bs1) + Number(getRandomNumber(10)),
                    l1: Number(runner.l1) + Number(getRandomNumber(10)),
                    ls1: Number(runner.ls1) + Number(getRandomNumber(10)),
                    b2: Number(runner.b2) + Number(getRandomNumber(10)),
                    bs2: Number(runner.bs2) + Number(getRandomNumber(10)),
                    l2: Number(runner.l2) + Number(getRandomNumber(10)),
                    ls2: Number(runner.ls2) + Number(getRandomNumber(10)),
                    b3: Number(runner.b3) + Number(getRandomNumber(10)),
                    bs3: Number(runner.bs3) + Number(getRandomNumber(10)),
                    l3: Number(runner.l3) + Number(getRandomNumber(10)),
                    ls3: Number(runner.ls3) + Number(getRandomNumber(10)),
                },
            ])
        );

        return {
            ...fancyevent,
            data: updatedData,
        };
    }

    return fancyevent;
}