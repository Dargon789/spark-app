import { Button } from '@/ui/atoms/new/button/Button'
import { Panel } from '@/ui/atoms/new/panel/Panel'

interface MyWalletDisconnectedProps {
  openConnectModal: () => void
}

export function MyWalletDisconnected({ openConnectModal }: MyWalletDisconnectedProps) {
  return (
    <Panel className="flex flex-col">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-base text-sky-950 md:text-xl">My Wallet</h3>
        <p className="text-slate-500 text-sm">Please connect a wallet to view your personal information here.</p>
      </div>
      <Button className="mt-7" onClick={openConnectModal}>
        Connect wallet
      </Button>
    </Panel>
  )
}
