import { TrackItemService } from '../services/TrackItemService';
import { SettingsService } from '../services/SettingsService';

export const trayModel: any = {
    namespace: 'tray',
    state: {
        lastLogItems: [],
        runningLogItem: null,
    },
    subscriptions: {
        setup({ dispatch }: any) {
            console.log('Tray data setup');

            dispatch({
                type: 'loadLastLogItems',
            });

            dispatch({
                type: 'getRunningLogItem',
            });
        },
    },

    effects: {
        *getRunningLogItem({ payload }: any, { call, put }: any) {
            console.log('getRunningLogItem');

            const runningLogItem = yield call(SettingsService.getRunningLogItem);
            console.log('got runningLogItem:', runningLogItem);

            yield put({
                type: 'setRunningLogItem',
                payload: {
                    runningLogItem,
                },
            });
        },
        *loadLastLogItems({ payload }: any, { call, put }: any) {
            console.log('loadLastLogItems');

            const lastLogItems = yield call(TrackItemService.findFirstLogItems);

            yield put({
                type: 'lastLogItems',
                payload: {
                    lastLogItems,
                },
            });
        },

        *startNewLogItem({ payload: { item } }: any, { call, put }: any) {
            console.log('startNewLogItem:', item);

            const createdItem = yield call(TrackItemService.startNewLogItem, item);
            console.log('Created item:', createdItem);

            yield put({
                type: 'loadLastLogItems',
            });
        },

        *stopRunningLogItem({ payload }: any, { call, put, select }: any) {
            console.log('stopRunningLogItem');

            const runningLogItem = yield select(state => state.tray.runningLogItem);

            if (runningLogItem) {
                const createdItem = yield call(
                    TrackItemService.stopRunningLogItem,
                    runningLogItem.id,
                );
                console.log('Created item:', createdItem);

                yield put({
                    type: 'loadLastLogItems',
                });
                yield put({
                    type: 'setRunningLogItem',
                    payload: {
                        runningLogItem: null,
                    },
                });
            } else {
                console.error('No running log item to stop');
            }
        },
    },
    reducers: {
        lastLogItems(state: any, { payload: { lastLogItems } }: any) {
            return {
                ...state,
                lastLogItems,
            };
        },
        setRunningLogItem(state: any, { payload: { runningLogItem } }: any) {
            return {
                ...state,
                runningLogItem,
            };
        },
    },
};
