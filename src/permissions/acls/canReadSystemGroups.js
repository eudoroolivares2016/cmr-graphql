import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'

/**
 * Check to see if the user can read system groups using
 * the cmr permissions api. In order to read system groups, the user must have the `read`
 * permission on the GROUP system_object.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canReadSystemGroups = rule()(async (parent, params, context) => {
  const { edlUsername } = context

  if (
    await hasPermission(
      context,
      {
        permissions: 'read',
        permissionOptions: {
          user_id: edlUsername,
          system_object: 'GROUP'
        }
      }
    )
  ) return true

  return forbiddenError('Not authorized to perform [read] on system object [GROUP]')
})
