import { gql } from "@apollo/client";

export const ADD_TRX = gql`
mutation AddTrx($form: TrxForm) {
  AddTrx(form: $form) {
    _id
    nominal
    userId
    walletId
    type
    category
    note
  }
}
`
