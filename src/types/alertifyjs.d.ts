declare module "alertifyjs" {
  interface NotifierSettings {
    position?: string;
    delay?: number;
  }

  interface Alertify {
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    set(section: "notifier", key: "position", value: string): void;
    set(section: "notifier", key: "delay", value: number): void;
    set(section: "notifier", key: keyof NotifierSettings, value: string | number): void;
  }

  const alertify: Alertify;
  export default alertify;
}
