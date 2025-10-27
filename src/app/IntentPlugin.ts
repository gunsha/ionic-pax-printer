import { registerPlugin, WebPlugin } from '@capacitor/core';
export interface IIntent {
  startActivity(options: { intent: string }): Promise<void>;
}

export class IntentPluginWeb extends WebPlugin implements IIntent {
  startActivity(options: { intent: string }): Promise<void> {
    return Promise.resolve();
  }
}

const IntentPlugin = registerPlugin<IIntent>('IntentPlugin', {
  web: new IntentPluginWeb(),
});

export default IntentPlugin;
