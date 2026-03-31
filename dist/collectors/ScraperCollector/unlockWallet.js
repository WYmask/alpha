"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockWallet = void 0;
const unlockWallet = async (page) => {
    // Wait for the iframe to be available and get its frame context
    const iframe = page.frameLocator('#ui-ses-iframe');
    // Interact with elements within the iframe
    const password = iframe.getByTestId('okd-input');
    await password.click();
    await password.fill('1234qwer');
    const submit = iframe.getByTestId('okd-button');
    await submit.click();
    await page.waitForTimeout(2000);
};
exports.unlockWallet = unlockWallet;
//# sourceMappingURL=unlockWallet.js.map