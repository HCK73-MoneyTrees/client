import { gql } from "@apollo/client";

export let GET_WALLET = gql`
  query GetWalletByUserLogin {
    getWalletByUserLogin {
      _id
      name
      type
      ownerId
      total
    }
  }
`;
export let GET_STATS = gql`
  query GetStatsByDateAndWalletId(
    $getStatsByDateAndWalletIdId: String
    $date: String
  ) {
    getStatsByDateAndWalletId(id: $getStatsByDateAndWalletIdId, date: $date) {
      _id
      totalAmount
      count
    }
  }
`;
export let GET_STATS_INCOME = gql`
  query GetStatsByDateAndWalletIdIncome(
    $getStatsByDateAndWalletIdIncomeId: String
    $date: String
  ) {
    getStatsByDateAndWalletIdIncome(
      id: $getStatsByDateAndWalletIdIncomeId
      date: $date
    ) {
      _id
      totalAmount
      count
    }
  }
`;

export let ADD_WALLET = gql`
  mutation AddWallet($form: walletForm) {
    addWallet(form: $form) {
      _id
      name
      type
      ownerId
      total
    }
  }
`;

export const INVITATION_WALLET = gql`
  query GetInvitedWalletByUserLogin {
    getInvitedWalletByUserLogin {
      _id
      name
      type
      ownerId
      total
      members {
        _id
        name
        username
        email
      }
      invited {
        _id
        name
        username
        email
      }
      result {
        _id
        name
        username
        email
      }
    }
  }
`;

export let ACC_INVITATION = gql`
  mutation AccInvitation($form: invForm) {
    accInvitation(form: $form) {
      _id
      name
      type
      ownerId
      total
      members {
        _id
        name
        username
        email
      }
      invited {
        _id
        name
        username
        email
      }
    }
  }
`;
export let DEC_INVITATION = gql`
  mutation DecInvitation($form: invForm) {
    decInvitation(form: $form) {
      _id
      name
      type
      ownerId
      total
      members {
        _id
        name
        username
        email
      }
      invited {
        _id
        name
        username
        email
      }
    }
  }
`;
