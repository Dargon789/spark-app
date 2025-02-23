import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { claimRewardsDialogConfig } from '@/features/dialogs/claim-rewards/ClaimRewardsDialog'
import { UseQueryResult } from '@tanstack/react-query'
import { RewardsInfo } from '../types'

export function useRewardsInfo(marketInfo: UseQueryResult<MarketInfo>): RewardsInfo {
  const openDialog = useOpenDialog()

  const rewards = (marketInfo.data?.userRewards ?? []).map((reward) => ({
    token: reward.token,
    amount: reward.value,
  }))

  const totalClaimableReward = rewards.reduce(
    (acc, { token, amount }) => NormalizedUnitNumber(acc.plus(token.toUSD(amount))),
    NormalizedUnitNumber(0),
  )

  return {
    rewards,
    onClaim: () => {
      openDialog(claimRewardsDialogConfig, {})
    },
    totalClaimableReward,
  }
}
