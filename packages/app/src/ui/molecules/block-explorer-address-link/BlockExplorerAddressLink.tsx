import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Address } from '@/ui/atoms/address/Address'
import { Link } from '@/ui/atoms/link/Link'
import { cn } from '@/ui/utils/style'
import { SquareArrowOutUpRight } from 'lucide-react'

interface BlockExplorerAddressLinkProps {
  address: CheckedAddress
  chainId?: number
  className?: string
  'data-testid'?: string
}

export function BlockExplorerAddressLink({
  address,
  chainId,
  className,
  'data-testid': testId,
}: BlockExplorerAddressLinkProps) {
  const contractLink = useBlockExplorerAddressLink({ address, chainId })

  return contractLink ? (
    <Link
      to={contractLink}
      external
      className={cn(
        'flex w-full max-w-64 items-center gap-1 text-inherit hover:text-inherit hover:underline',
        className,
      )}
      data-testid={testId}
    >
      <Address address={address} postfix={<SquareArrowOutUpRight className="icon-xs shrink-0 text-secondary" />} />
    </Link>
  ) : (
    <span className={cn('flex w-full max-w-64 items-center gap-1', className)} data-testid={testId}>
      <Address address={address} />
    </span>
  )
}
