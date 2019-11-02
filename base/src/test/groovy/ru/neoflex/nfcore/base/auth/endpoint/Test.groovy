package ru.neoflex.nfcore.base.auth.endpoint


import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import org.eclipse.emf.ecore.EObject
import ru.neoflex.nfcore.base.auth.*
import ru.neoflex.nfcore.base.services.Context

class Test {
    static GrantStatus permitted(Role role, ActionType actionType, EObject eObject) {
        return role.permitted(actionType, eObject)
    }
    static GrantStatus permitted(ObjectNode jsonNode) {
        def mapper = Context.current.store.createMapper()
        def role = mapper.reader().treeToValue(jsonNode.get("role"), Role.class)
        def actionType = new ObjectMapper().reader().treeToValue(jsonNode.get("actionType"), ActionType.class)
        def eObject = mapper.reader().treeToValue(jsonNode.get("eObject"), EObject.class)
        return role.permitted(actionType, eObject)
    }
}
