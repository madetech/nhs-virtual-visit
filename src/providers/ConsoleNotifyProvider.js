class ConsoleNotifyProvider {
  notify(contactNumber, linkUrl) {
    console.log(`[ConsoleNotifyProvider] ${contactNumber} -> ${linkUrl}`);
  }
}

export default ConsoleNotifyProvider;
