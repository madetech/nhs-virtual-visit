import logger from "../../logger";

class ConsoleNotifyProvider {
  notify(linkUrl) {
    logger.info(`[ConsoleNotifyProvider] Link sent: ${linkUrl}`);
  }
}

export default ConsoleNotifyProvider;
