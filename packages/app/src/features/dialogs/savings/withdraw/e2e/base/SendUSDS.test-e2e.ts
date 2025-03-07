import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send USDS', () => {
  const fork = setupFork({ chainId: base.id, blockNumber: 22143788n, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const usds = TOKENS_ON_FORK[base.id].USDS

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)

    await savingsPage.clickSendSUsdsButtonAction()
    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('has correct action plan', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,938.24 sUSDS',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDS',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDS',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsUsdsBalance({ susdsBalance: '3,061.76 sUSDS', estimatedUsdsValue: '3,089' })
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
  })
})
