# Editing network membership

The network edit form (`src/modules/UpdateNetwork/UpdateNetwork.tsx`) compares the selected custodians with the network's current members using `diffMembership` (`src/utils/membership.ts`). It calls `addCustodiansToNetwork` with only the newly selected custodians and `removeCustodiansFromNetwork` with only the deselected ones. Before this, the form re-added every selected custodian and ignored removals, so deselecting a custodian did nothing.
