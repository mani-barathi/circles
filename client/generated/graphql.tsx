import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Circle = {
  __typename?: 'Circle';
  id: Scalars['ID'];
  name: Scalars['String'];
  creatorId: Scalars['String'];
  totalMembers: Scalars['Int'];
  isPublic: Scalars['Boolean'];
  isMember: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  creator?: Maybe<User>;
  invitations?: Maybe<Array<Invitation>>;
  memberRequests?: Maybe<Array<MemberRequest>>;
  members?: Maybe<Array<Member>>;
  description?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type CircleResponse = {
  __typename?: 'CircleResponse';
  circle?: Maybe<Circle>;
  errors?: Maybe<Array<CustomError>>;
};

export type CustomError = {
  __typename?: 'CustomError';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  active: Scalars['Boolean'];
  circleId?: Maybe<Scalars['Int']>;
  circle: Circle;
  senderId?: Maybe<Scalars['Int']>;
  sender: User;
  recipientId?: Maybe<Scalars['Int']>;
  recipient: User;
  createdAt: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type InvitationResponse = {
  __typename?: 'InvitationResponse';
  invitation?: Maybe<Invitation>;
  errors?: Maybe<Array<CustomError>>;
};

export type Member = {
  __typename?: 'Member';
  userId: Scalars['Int'];
  user?: Maybe<User>;
  circleId?: Maybe<Scalars['Int']>;
  circle?: Maybe<Circle>;
  isAdmin: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type MemberRequest = {
  __typename?: 'MemberRequest';
  active: Scalars['Boolean'];
  circleId?: Maybe<Scalars['Int']>;
  circle: Circle;
  userId?: Maybe<Scalars['Int']>;
  user: User;
  createdAt: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['String'];
  authorId: Scalars['Int'];
  author?: Maybe<User>;
  circleId: Scalars['Int'];
  circle?: Maybe<Circle>;
  text: Scalars['String'];
  createdAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createCircle: CircleResponse;
  joinCircle: Scalars['Boolean'];
  togglePublicCircle: Scalars['Boolean'];
  exitCircle: Scalars['Boolean'];
  deleteCircle: Scalars['Boolean'];
  acceptInvitation: Scalars['Boolean'];
  rejectInvitation: Scalars['Boolean'];
  cancelInvitation: Scalars['Boolean'];
  sendInvitation: InvitationResponse;
  removeMember: Scalars['Boolean'];
  acceptMemberRequest: Scalars['Boolean'];
  declineMemberRequest: Scalars['Boolean'];
  cancelMemberRequest: Scalars['Boolean'];
  sendMemberRequest: Scalars['Boolean'];
  createPost: Post;
  deletePost: Scalars['Boolean'];
  likeOrDislike: Scalars['Boolean'];
  sendMessage: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateCircleArgs = {
  isPublic: Scalars['Boolean'];
  description: Scalars['String'];
  name: Scalars['String'];
};


export type MutationJoinCircleArgs = {
  circleId: Scalars['Int'];
};


export type MutationTogglePublicCircleArgs = {
  isPublic: Scalars['Boolean'];
  circleId: Scalars['Int'];
};


export type MutationExitCircleArgs = {
  circleId: Scalars['Int'];
};


export type MutationDeleteCircleArgs = {
  circleId: Scalars['Int'];
};


export type MutationAcceptInvitationArgs = {
  circleId: Scalars['Int'];
  senderId: Scalars['Int'];
};


export type MutationRejectInvitationArgs = {
  circleId: Scalars['Int'];
  senderId: Scalars['Int'];
};


export type MutationCancelInvitationArgs = {
  circleId: Scalars['Int'];
  recipientId: Scalars['Int'];
};


export type MutationSendInvitationArgs = {
  circleId: Scalars['Int'];
  recipiantName: Scalars['String'];
};


export type MutationRemoveMemberArgs = {
  memberId: Scalars['Int'];
  circleId: Scalars['Int'];
};


export type MutationAcceptMemberRequestArgs = {
  circleId: Scalars['Int'];
  memberId: Scalars['Int'];
};


export type MutationDeclineMemberRequestArgs = {
  circleId: Scalars['Int'];
  memberId: Scalars['Int'];
};


export type MutationCancelMemberRequestArgs = {
  circleId: Scalars['Int'];
};


export type MutationSendMemberRequestArgs = {
  circleId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  image?: Maybe<Scalars['Upload']>;
  circleId: Scalars['Int'];
  text: Scalars['String'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['Int'];
};


export type MutationLikeOrDislikeArgs = {
  isDislike: Scalars['Boolean'];
  circleId: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationSendMessageArgs = {
  username: Scalars['String'];
  circleId: Scalars['Int'];
  text: Scalars['String'];
};

export type PaginatedCircle = {
  __typename?: 'PaginatedCircle';
  data: Array<Circle>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedMember = {
  __typename?: 'PaginatedMember';
  data: Array<Member>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedMemberRequest = {
  __typename?: 'PaginatedMemberRequest';
  data: Array<MemberRequest>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedMessage = {
  __typename?: 'PaginatedMessage';
  data: Array<Message>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedPost = {
  __typename?: 'PaginatedPost';
  data: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  likesCount: Scalars['Int'];
  hasLiked?: Maybe<Scalars['Boolean']>;
  creatorId: Scalars['Int'];
  creator?: Maybe<User>;
  circleId: Scalars['Int'];
  circle?: Maybe<Circle>;
  imageUrl?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  myCircles: PaginatedCircle;
  getCircles: Array<Circle>;
  searchCircle: PaginatedCircle;
  circle: Circle;
  getIntivations: Array<Invitation>;
  getSentInvitationOfCircle: Array<Invitation>;
  members: PaginatedMember;
  isMemberRequestExists: Scalars['Boolean'];
  memberRequests: PaginatedMemberRequest;
  posts: PaginatedPost;
  myPosts: PaginatedPost;
  messages: PaginatedMessage;
};


export type QueryMyCirclesArgs = {
  cursor?: Maybe<Scalars['String']>;
};


export type QuerySearchCircleArgs = {
  cursor?: Maybe<Scalars['String']>;
  query: Scalars['String'];
};


export type QueryCircleArgs = {
  circleId: Scalars['Int'];
};


export type QueryGetSentInvitationOfCircleArgs = {
  circleId: Scalars['Int'];
};


export type QueryMembersArgs = {
  cursor?: Maybe<Scalars['String']>;
  circleId: Scalars['Int'];
};


export type QueryIsMemberRequestExistsArgs = {
  circleId: Scalars['Int'];
};


export type QueryMemberRequestsArgs = {
  cursor?: Maybe<Scalars['String']>;
  circleId: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  circleId: Scalars['Int'];
};


export type QueryMyPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  circleId: Scalars['Int'];
};


export type QueryMessagesArgs = {
  cursor?: Maybe<Scalars['String']>;
  circleId: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
};


export type SubscriptionNewMessageArgs = {
  circleId: Scalars['Int'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  myCircles: Array<Circle>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<CustomError>>;
};

export type AcceptInviteMutationVariables = Exact<{
  circleId: Scalars['Int'];
  senderId: Scalars['Int'];
}>;


export type AcceptInviteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'acceptInvitation'>
);

export type AcceptMemberRequestMutationVariables = Exact<{
  circleId: Scalars['Int'];
  memberId: Scalars['Int'];
}>;


export type AcceptMemberRequestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'acceptMemberRequest'>
);

export type CancelInvitationMutationVariables = Exact<{
  circleId: Scalars['Int'];
  recipientId: Scalars['Int'];
}>;


export type CancelInvitationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'cancelInvitation'>
);

export type CancelMemberRequestMutationVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type CancelMemberRequestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'cancelMemberRequest'>
);

export type CreatePostMutationVariables = Exact<{
  circleId: Scalars['Int'];
  text: Scalars['String'];
  image?: Maybe<Scalars['Upload']>;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'text' | 'creatorId' | 'circleId' | 'createdAt'>
  ) }
);

export type CreateCircleMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  isPublic: Scalars['Boolean'];
}>;


export type CreateCircleMutation = (
  { __typename?: 'Mutation' }
  & { createCircle: (
    { __typename?: 'CircleResponse' }
    & { circle?: Maybe<(
      { __typename?: 'Circle' }
      & Pick<Circle, 'id' | 'name' | 'description' | 'creatorId' | 'createdAt'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'CustomError' }
      & Pick<CustomError, 'path' | 'message'>
    )>> }
  ) }
);

export type DeclineMemberRequestMutationVariables = Exact<{
  circleId: Scalars['Int'];
  memberId: Scalars['Int'];
}>;


export type DeclineMemberRequestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'declineMemberRequest'>
);

export type DeleteCircleMutationVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type DeleteCircleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCircle'>
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ExitCircleMutationVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type ExitCircleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'exitCircle'>
);

export type JoinCircleMutationVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type JoinCircleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'joinCircle'>
);

export type LikeOrDislikeMutationVariables = Exact<{
  postId: Scalars['Int'];
  circleId: Scalars['Int'];
  isDislike: Scalars['Boolean'];
}>;


export type LikeOrDislikeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'likeOrDislike'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'CustomError' }
      & Pick<CustomError, 'path' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'CustomError' }
      & Pick<CustomError, 'path' | 'message'>
    )>> }
  ) }
);

export type RejectInvitationMutationVariables = Exact<{
  circleId: Scalars['Int'];
  senderId: Scalars['Int'];
}>;


export type RejectInvitationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'rejectInvitation'>
);

export type RemoveMemberMutationVariables = Exact<{
  circleId: Scalars['Int'];
  memberId: Scalars['Int'];
}>;


export type RemoveMemberMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeMember'>
);

export type SendInvitationMutationVariables = Exact<{
  circleId: Scalars['Int'];
  recipiantName: Scalars['String'];
}>;


export type SendInvitationMutation = (
  { __typename?: 'Mutation' }
  & { sendInvitation: (
    { __typename?: 'InvitationResponse' }
    & { invitation?: Maybe<(
      { __typename?: 'Invitation' }
      & Pick<Invitation, 'circleId' | 'senderId' | 'recipientId' | 'active'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'CustomError' }
      & Pick<CustomError, 'path' | 'message'>
    )>> }
  ) }
);

export type SendMemberRequestMutationVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type SendMemberRequestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendMemberRequest'>
);

export type SendMessageMutationVariables = Exact<{
  circleId: Scalars['Int'];
  text: Scalars['String'];
  username: Scalars['String'];
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendMessage'>
);

export type TogglePublicCircleMutationVariables = Exact<{
  circleId: Scalars['Int'];
  isPublic: Scalars['Boolean'];
}>;


export type TogglePublicCircleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'togglePublicCircle'>
);

export type CircleQueryVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type CircleQuery = (
  { __typename?: 'Query' }
  & { circle: (
    { __typename?: 'Circle' }
    & Pick<Circle, 'id' | 'name' | 'description' | 'createdAt' | 'totalMembers' | 'isAdmin' | 'isMember' | 'isPublic'>
    & { creator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username'>
    )> }
  ) }
);

export type GetCirclesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCirclesQuery = (
  { __typename?: 'Query' }
  & { getCircles: Array<(
    { __typename?: 'Circle' }
    & Pick<Circle, 'id' | 'name' | 'totalMembers' | 'updatedAt' | 'createdAt' | 'isPublic'>
    & { creator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username'>
    )> }
  )> }
);

export type GetIntivationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIntivationsQuery = (
  { __typename?: 'Query' }
  & { getIntivations: Array<(
    { __typename?: 'Invitation' }
    & Pick<Invitation, 'active' | 'createdAt'>
    & { circle: (
      { __typename?: 'Circle' }
      & Pick<Circle, 'id' | 'name'>
    ), sender: (
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id'>
    ) }
  )> }
);

export type IsMemberRequestExistsQueryVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type IsMemberRequestExistsQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isMemberRequestExists'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email'>
  )> }
);

export type MemberRequestsQueryVariables = Exact<{
  circleId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MemberRequestsQuery = (
  { __typename?: 'Query' }
  & { memberRequests: (
    { __typename?: 'PaginatedMemberRequest' }
    & Pick<PaginatedMemberRequest, 'hasMore'>
    & { data: Array<(
      { __typename?: 'MemberRequest' }
      & Pick<MemberRequest, 'userId' | 'circleId' | 'createdAt'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      ) }
    )> }
  ) }
);

export type MembersQueryVariables = Exact<{
  circleId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MembersQuery = (
  { __typename?: 'Query' }
  & { members: (
    { __typename?: 'PaginatedMember' }
    & Pick<PaginatedMember, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'userId' | 'isAdmin' | 'createdAt'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'username'>
      )> }
    )> }
  ) }
);

export type MessagesQueryVariables = Exact<{
  circleId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages: (
    { __typename?: 'PaginatedMessage' }
    & Pick<PaginatedMessage, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'text' | 'authorId' | 'circleId' | 'createdAt'>
      & { author?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )> }
    )> }
  ) }
);

export type MyCirclesQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
}>;


export type MyCirclesQuery = (
  { __typename?: 'Query' }
  & { myCircles: (
    { __typename?: 'PaginatedCircle' }
    & Pick<PaginatedCircle, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Circle' }
      & Pick<Circle, 'id' | 'name' | 'isAdmin' | 'updatedAt' | 'isPublic'>
    )> }
  ) }
);

export type MyPostsQueryVariables = Exact<{
  circleId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MyPostsQuery = (
  { __typename?: 'Query' }
  & { myPosts: (
    { __typename?: 'PaginatedPost' }
    & Pick<PaginatedPost, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'circleId' | 'createdAt' | 'likesCount' | 'hasLiked' | 'imageUrl' | 'text'>
    )> }
  ) }
);

export type PostsQueryVariables = Exact<{
  circleId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPost' }
    & Pick<PaginatedPost, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'creatorId' | 'createdAt' | 'likesCount' | 'hasLiked' | 'imageUrl' | 'text'>
      & { creator?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )> }
    )> }
  ) }
);

export type SearchCircleQueryVariables = Exact<{
  query: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type SearchCircleQuery = (
  { __typename?: 'Query' }
  & { searchCircle: (
    { __typename?: 'PaginatedCircle' }
    & Pick<PaginatedCircle, 'hasMore'>
    & { data: Array<(
      { __typename?: 'Circle' }
      & Pick<Circle, 'id' | 'name' | 'totalMembers' | 'isPublic' | 'updatedAt'>
      & { creator?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'username'>
      )> }
    )> }
  ) }
);

export type SentInvitaionsQueryVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type SentInvitaionsQuery = (
  { __typename?: 'Query' }
  & { getSentInvitationOfCircle: Array<(
    { __typename?: 'Invitation' }
    & Pick<Invitation, 'senderId' | 'recipientId' | 'circleId' | 'createdAt'>
    & { recipient: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type NewMessageSubscriptionVariables = Exact<{
  circleId: Scalars['Int'];
}>;


export type NewMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'circleId' | 'text' | 'authorId' | 'createdAt'>
    & { author?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);


export const AcceptInviteDocument = gql`
    mutation AcceptInvite($circleId: Int!, $senderId: Int!) {
  acceptInvitation(circleId: $circleId, senderId: $senderId)
}
    `;
export type AcceptInviteMutationFn = Apollo.MutationFunction<AcceptInviteMutation, AcceptInviteMutationVariables>;

/**
 * __useAcceptInviteMutation__
 *
 * To run a mutation, you first call `useAcceptInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInviteMutation, { data, loading, error }] = useAcceptInviteMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      senderId: // value for 'senderId'
 *   },
 * });
 */
export function useAcceptInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInviteMutation, AcceptInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(AcceptInviteDocument, options);
      }
export type AcceptInviteMutationHookResult = ReturnType<typeof useAcceptInviteMutation>;
export type AcceptInviteMutationResult = Apollo.MutationResult<AcceptInviteMutation>;
export type AcceptInviteMutationOptions = Apollo.BaseMutationOptions<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const AcceptMemberRequestDocument = gql`
    mutation AcceptMemberRequest($circleId: Int!, $memberId: Int!) {
  acceptMemberRequest(circleId: $circleId, memberId: $memberId)
}
    `;
export type AcceptMemberRequestMutationFn = Apollo.MutationFunction<AcceptMemberRequestMutation, AcceptMemberRequestMutationVariables>;

/**
 * __useAcceptMemberRequestMutation__
 *
 * To run a mutation, you first call `useAcceptMemberRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptMemberRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptMemberRequestMutation, { data, loading, error }] = useAcceptMemberRequestMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAcceptMemberRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptMemberRequestMutation, AcceptMemberRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptMemberRequestMutation, AcceptMemberRequestMutationVariables>(AcceptMemberRequestDocument, options);
      }
export type AcceptMemberRequestMutationHookResult = ReturnType<typeof useAcceptMemberRequestMutation>;
export type AcceptMemberRequestMutationResult = Apollo.MutationResult<AcceptMemberRequestMutation>;
export type AcceptMemberRequestMutationOptions = Apollo.BaseMutationOptions<AcceptMemberRequestMutation, AcceptMemberRequestMutationVariables>;
export const CancelInvitationDocument = gql`
    mutation CancelInvitation($circleId: Int!, $recipientId: Int!) {
  cancelInvitation(circleId: $circleId, recipientId: $recipientId)
}
    `;
export type CancelInvitationMutationFn = Apollo.MutationFunction<CancelInvitationMutation, CancelInvitationMutationVariables>;

/**
 * __useCancelInvitationMutation__
 *
 * To run a mutation, you first call `useCancelInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelInvitationMutation, { data, loading, error }] = useCancelInvitationMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      recipientId: // value for 'recipientId'
 *   },
 * });
 */
export function useCancelInvitationMutation(baseOptions?: Apollo.MutationHookOptions<CancelInvitationMutation, CancelInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelInvitationMutation, CancelInvitationMutationVariables>(CancelInvitationDocument, options);
      }
export type CancelInvitationMutationHookResult = ReturnType<typeof useCancelInvitationMutation>;
export type CancelInvitationMutationResult = Apollo.MutationResult<CancelInvitationMutation>;
export type CancelInvitationMutationOptions = Apollo.BaseMutationOptions<CancelInvitationMutation, CancelInvitationMutationVariables>;
export const CancelMemberRequestDocument = gql`
    mutation CancelMemberRequest($circleId: Int!) {
  cancelMemberRequest(circleId: $circleId)
}
    `;
export type CancelMemberRequestMutationFn = Apollo.MutationFunction<CancelMemberRequestMutation, CancelMemberRequestMutationVariables>;

/**
 * __useCancelMemberRequestMutation__
 *
 * To run a mutation, you first call `useCancelMemberRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelMemberRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelMemberRequestMutation, { data, loading, error }] = useCancelMemberRequestMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useCancelMemberRequestMutation(baseOptions?: Apollo.MutationHookOptions<CancelMemberRequestMutation, CancelMemberRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelMemberRequestMutation, CancelMemberRequestMutationVariables>(CancelMemberRequestDocument, options);
      }
export type CancelMemberRequestMutationHookResult = ReturnType<typeof useCancelMemberRequestMutation>;
export type CancelMemberRequestMutationResult = Apollo.MutationResult<CancelMemberRequestMutation>;
export type CancelMemberRequestMutationOptions = Apollo.BaseMutationOptions<CancelMemberRequestMutation, CancelMemberRequestMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($circleId: Int!, $text: String!, $image: Upload) {
  createPost(circleId: $circleId, text: $text, image: $image) {
    id
    text
    creatorId
    circleId
    createdAt
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      text: // value for 'text'
 *      image: // value for 'image'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const CreateCircleDocument = gql`
    mutation CreateCircle($name: String!, $description: String!, $isPublic: Boolean!) {
  createCircle(name: $name, description: $description, isPublic: $isPublic) {
    circle {
      id
      name
      description
      creatorId
      createdAt
    }
    errors {
      path
      message
    }
  }
}
    `;
export type CreateCircleMutationFn = Apollo.MutationFunction<CreateCircleMutation, CreateCircleMutationVariables>;

/**
 * __useCreateCircleMutation__
 *
 * To run a mutation, you first call `useCreateCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCircleMutation, { data, loading, error }] = useCreateCircleMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      isPublic: // value for 'isPublic'
 *   },
 * });
 */
export function useCreateCircleMutation(baseOptions?: Apollo.MutationHookOptions<CreateCircleMutation, CreateCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCircleMutation, CreateCircleMutationVariables>(CreateCircleDocument, options);
      }
export type CreateCircleMutationHookResult = ReturnType<typeof useCreateCircleMutation>;
export type CreateCircleMutationResult = Apollo.MutationResult<CreateCircleMutation>;
export type CreateCircleMutationOptions = Apollo.BaseMutationOptions<CreateCircleMutation, CreateCircleMutationVariables>;
export const DeclineMemberRequestDocument = gql`
    mutation DeclineMemberRequest($circleId: Int!, $memberId: Int!) {
  declineMemberRequest(circleId: $circleId, memberId: $memberId)
}
    `;
export type DeclineMemberRequestMutationFn = Apollo.MutationFunction<DeclineMemberRequestMutation, DeclineMemberRequestMutationVariables>;

/**
 * __useDeclineMemberRequestMutation__
 *
 * To run a mutation, you first call `useDeclineMemberRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineMemberRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineMemberRequestMutation, { data, loading, error }] = useDeclineMemberRequestMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useDeclineMemberRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeclineMemberRequestMutation, DeclineMemberRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineMemberRequestMutation, DeclineMemberRequestMutationVariables>(DeclineMemberRequestDocument, options);
      }
export type DeclineMemberRequestMutationHookResult = ReturnType<typeof useDeclineMemberRequestMutation>;
export type DeclineMemberRequestMutationResult = Apollo.MutationResult<DeclineMemberRequestMutation>;
export type DeclineMemberRequestMutationOptions = Apollo.BaseMutationOptions<DeclineMemberRequestMutation, DeclineMemberRequestMutationVariables>;
export const DeleteCircleDocument = gql`
    mutation DeleteCircle($circleId: Int!) {
  deleteCircle(circleId: $circleId)
}
    `;
export type DeleteCircleMutationFn = Apollo.MutationFunction<DeleteCircleMutation, DeleteCircleMutationVariables>;

/**
 * __useDeleteCircleMutation__
 *
 * To run a mutation, you first call `useDeleteCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCircleMutation, { data, loading, error }] = useDeleteCircleMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useDeleteCircleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCircleMutation, DeleteCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCircleMutation, DeleteCircleMutationVariables>(DeleteCircleDocument, options);
      }
export type DeleteCircleMutationHookResult = ReturnType<typeof useDeleteCircleMutation>;
export type DeleteCircleMutationResult = Apollo.MutationResult<DeleteCircleMutation>;
export type DeleteCircleMutationOptions = Apollo.BaseMutationOptions<DeleteCircleMutation, DeleteCircleMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Int!) {
  deletePost(postId: $postId)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const ExitCircleDocument = gql`
    mutation ExitCircle($circleId: Int!) {
  exitCircle(circleId: $circleId)
}
    `;
export type ExitCircleMutationFn = Apollo.MutationFunction<ExitCircleMutation, ExitCircleMutationVariables>;

/**
 * __useExitCircleMutation__
 *
 * To run a mutation, you first call `useExitCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExitCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [exitCircleMutation, { data, loading, error }] = useExitCircleMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useExitCircleMutation(baseOptions?: Apollo.MutationHookOptions<ExitCircleMutation, ExitCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExitCircleMutation, ExitCircleMutationVariables>(ExitCircleDocument, options);
      }
export type ExitCircleMutationHookResult = ReturnType<typeof useExitCircleMutation>;
export type ExitCircleMutationResult = Apollo.MutationResult<ExitCircleMutation>;
export type ExitCircleMutationOptions = Apollo.BaseMutationOptions<ExitCircleMutation, ExitCircleMutationVariables>;
export const JoinCircleDocument = gql`
    mutation JoinCircle($circleId: Int!) {
  joinCircle(circleId: $circleId)
}
    `;
export type JoinCircleMutationFn = Apollo.MutationFunction<JoinCircleMutation, JoinCircleMutationVariables>;

/**
 * __useJoinCircleMutation__
 *
 * To run a mutation, you first call `useJoinCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinCircleMutation, { data, loading, error }] = useJoinCircleMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useJoinCircleMutation(baseOptions?: Apollo.MutationHookOptions<JoinCircleMutation, JoinCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinCircleMutation, JoinCircleMutationVariables>(JoinCircleDocument, options);
      }
export type JoinCircleMutationHookResult = ReturnType<typeof useJoinCircleMutation>;
export type JoinCircleMutationResult = Apollo.MutationResult<JoinCircleMutation>;
export type JoinCircleMutationOptions = Apollo.BaseMutationOptions<JoinCircleMutation, JoinCircleMutationVariables>;
export const LikeOrDislikeDocument = gql`
    mutation LikeOrDislike($postId: Int!, $circleId: Int!, $isDislike: Boolean!) {
  likeOrDislike(postId: $postId, circleId: $circleId, isDislike: $isDislike)
}
    `;
export type LikeOrDislikeMutationFn = Apollo.MutationFunction<LikeOrDislikeMutation, LikeOrDislikeMutationVariables>;

/**
 * __useLikeOrDislikeMutation__
 *
 * To run a mutation, you first call `useLikeOrDislikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeOrDislikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeOrDislikeMutation, { data, loading, error }] = useLikeOrDislikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      circleId: // value for 'circleId'
 *      isDislike: // value for 'isDislike'
 *   },
 * });
 */
export function useLikeOrDislikeMutation(baseOptions?: Apollo.MutationHookOptions<LikeOrDislikeMutation, LikeOrDislikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeOrDislikeMutation, LikeOrDislikeMutationVariables>(LikeOrDislikeDocument, options);
      }
export type LikeOrDislikeMutationHookResult = ReturnType<typeof useLikeOrDislikeMutation>;
export type LikeOrDislikeMutationResult = Apollo.MutationResult<LikeOrDislikeMutation>;
export type LikeOrDislikeMutationOptions = Apollo.BaseMutationOptions<LikeOrDislikeMutation, LikeOrDislikeMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      path
      message
    }
    user {
      id
      username
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $email: String!) {
  register(email: $email, password: $password, username: $username) {
    user {
      id
      username
      email
    }
    errors {
      path
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RejectInvitationDocument = gql`
    mutation RejectInvitation($circleId: Int!, $senderId: Int!) {
  rejectInvitation(circleId: $circleId, senderId: $senderId)
}
    `;
export type RejectInvitationMutationFn = Apollo.MutationFunction<RejectInvitationMutation, RejectInvitationMutationVariables>;

/**
 * __useRejectInvitationMutation__
 *
 * To run a mutation, you first call `useRejectInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectInvitationMutation, { data, loading, error }] = useRejectInvitationMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      senderId: // value for 'senderId'
 *   },
 * });
 */
export function useRejectInvitationMutation(baseOptions?: Apollo.MutationHookOptions<RejectInvitationMutation, RejectInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectInvitationMutation, RejectInvitationMutationVariables>(RejectInvitationDocument, options);
      }
export type RejectInvitationMutationHookResult = ReturnType<typeof useRejectInvitationMutation>;
export type RejectInvitationMutationResult = Apollo.MutationResult<RejectInvitationMutation>;
export type RejectInvitationMutationOptions = Apollo.BaseMutationOptions<RejectInvitationMutation, RejectInvitationMutationVariables>;
export const RemoveMemberDocument = gql`
    mutation removeMember($circleId: Int!, $memberId: Int!) {
  removeMember(circleId: $circleId, memberId: $memberId)
}
    `;
export type RemoveMemberMutationFn = Apollo.MutationFunction<RemoveMemberMutation, RemoveMemberMutationVariables>;

/**
 * __useRemoveMemberMutation__
 *
 * To run a mutation, you first call `useRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberMutation, { data, loading, error }] = useRemoveMemberMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useRemoveMemberMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMemberMutation, RemoveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMemberMutation, RemoveMemberMutationVariables>(RemoveMemberDocument, options);
      }
export type RemoveMemberMutationHookResult = ReturnType<typeof useRemoveMemberMutation>;
export type RemoveMemberMutationResult = Apollo.MutationResult<RemoveMemberMutation>;
export type RemoveMemberMutationOptions = Apollo.BaseMutationOptions<RemoveMemberMutation, RemoveMemberMutationVariables>;
export const SendInvitationDocument = gql`
    mutation SendInvitation($circleId: Int!, $recipiantName: String!) {
  sendInvitation(circleId: $circleId, recipiantName: $recipiantName) {
    invitation {
      circleId
      senderId
      recipientId
      active
    }
    errors {
      path
      message
    }
  }
}
    `;
export type SendInvitationMutationFn = Apollo.MutationFunction<SendInvitationMutation, SendInvitationMutationVariables>;

/**
 * __useSendInvitationMutation__
 *
 * To run a mutation, you first call `useSendInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInvitationMutation, { data, loading, error }] = useSendInvitationMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      recipiantName: // value for 'recipiantName'
 *   },
 * });
 */
export function useSendInvitationMutation(baseOptions?: Apollo.MutationHookOptions<SendInvitationMutation, SendInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendInvitationMutation, SendInvitationMutationVariables>(SendInvitationDocument, options);
      }
export type SendInvitationMutationHookResult = ReturnType<typeof useSendInvitationMutation>;
export type SendInvitationMutationResult = Apollo.MutationResult<SendInvitationMutation>;
export type SendInvitationMutationOptions = Apollo.BaseMutationOptions<SendInvitationMutation, SendInvitationMutationVariables>;
export const SendMemberRequestDocument = gql`
    mutation SendMemberRequest($circleId: Int!) {
  sendMemberRequest(circleId: $circleId)
}
    `;
export type SendMemberRequestMutationFn = Apollo.MutationFunction<SendMemberRequestMutation, SendMemberRequestMutationVariables>;

/**
 * __useSendMemberRequestMutation__
 *
 * To run a mutation, you first call `useSendMemberRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMemberRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMemberRequestMutation, { data, loading, error }] = useSendMemberRequestMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useSendMemberRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendMemberRequestMutation, SendMemberRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMemberRequestMutation, SendMemberRequestMutationVariables>(SendMemberRequestDocument, options);
      }
export type SendMemberRequestMutationHookResult = ReturnType<typeof useSendMemberRequestMutation>;
export type SendMemberRequestMutationResult = Apollo.MutationResult<SendMemberRequestMutation>;
export type SendMemberRequestMutationOptions = Apollo.BaseMutationOptions<SendMemberRequestMutation, SendMemberRequestMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($circleId: Int!, $text: String!, $username: String!) {
  sendMessage(circleId: $circleId, text: $text, username: $username)
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      text: // value for 'text'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const TogglePublicCircleDocument = gql`
    mutation TogglePublicCircle($circleId: Int!, $isPublic: Boolean!) {
  togglePublicCircle(isPublic: $isPublic, circleId: $circleId)
}
    `;
export type TogglePublicCircleMutationFn = Apollo.MutationFunction<TogglePublicCircleMutation, TogglePublicCircleMutationVariables>;

/**
 * __useTogglePublicCircleMutation__
 *
 * To run a mutation, you first call `useTogglePublicCircleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePublicCircleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePublicCircleMutation, { data, loading, error }] = useTogglePublicCircleMutation({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      isPublic: // value for 'isPublic'
 *   },
 * });
 */
export function useTogglePublicCircleMutation(baseOptions?: Apollo.MutationHookOptions<TogglePublicCircleMutation, TogglePublicCircleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePublicCircleMutation, TogglePublicCircleMutationVariables>(TogglePublicCircleDocument, options);
      }
export type TogglePublicCircleMutationHookResult = ReturnType<typeof useTogglePublicCircleMutation>;
export type TogglePublicCircleMutationResult = Apollo.MutationResult<TogglePublicCircleMutation>;
export type TogglePublicCircleMutationOptions = Apollo.BaseMutationOptions<TogglePublicCircleMutation, TogglePublicCircleMutationVariables>;
export const CircleDocument = gql`
    query Circle($circleId: Int!) {
  circle(circleId: $circleId) {
    id
    name
    description
    createdAt
    totalMembers
    isAdmin
    isMember
    isPublic
    creator {
      username
    }
  }
}
    `;

/**
 * __useCircleQuery__
 *
 * To run a query within a React component, call `useCircleQuery` and pass it any options that fit your needs.
 * When your component renders, `useCircleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCircleQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useCircleQuery(baseOptions: Apollo.QueryHookOptions<CircleQuery, CircleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CircleQuery, CircleQueryVariables>(CircleDocument, options);
      }
export function useCircleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CircleQuery, CircleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CircleQuery, CircleQueryVariables>(CircleDocument, options);
        }
export type CircleQueryHookResult = ReturnType<typeof useCircleQuery>;
export type CircleLazyQueryHookResult = ReturnType<typeof useCircleLazyQuery>;
export type CircleQueryResult = Apollo.QueryResult<CircleQuery, CircleQueryVariables>;
export const GetCirclesDocument = gql`
    query GetCircles {
  getCircles {
    id
    name
    totalMembers
    updatedAt
    createdAt
    isPublic
    creator {
      username
    }
  }
}
    `;

/**
 * __useGetCirclesQuery__
 *
 * To run a query within a React component, call `useGetCirclesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCirclesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCirclesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCirclesQuery(baseOptions?: Apollo.QueryHookOptions<GetCirclesQuery, GetCirclesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCirclesQuery, GetCirclesQueryVariables>(GetCirclesDocument, options);
      }
export function useGetCirclesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCirclesQuery, GetCirclesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCirclesQuery, GetCirclesQueryVariables>(GetCirclesDocument, options);
        }
export type GetCirclesQueryHookResult = ReturnType<typeof useGetCirclesQuery>;
export type GetCirclesLazyQueryHookResult = ReturnType<typeof useGetCirclesLazyQuery>;
export type GetCirclesQueryResult = Apollo.QueryResult<GetCirclesQuery, GetCirclesQueryVariables>;
export const GetIntivationsDocument = gql`
    query GetIntivations {
  getIntivations {
    active
    createdAt
    circle {
      id
      name
    }
    sender {
      username
      id
    }
  }
}
    `;

/**
 * __useGetIntivationsQuery__
 *
 * To run a query within a React component, call `useGetIntivationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIntivationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIntivationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIntivationsQuery(baseOptions?: Apollo.QueryHookOptions<GetIntivationsQuery, GetIntivationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntivationsQuery, GetIntivationsQueryVariables>(GetIntivationsDocument, options);
      }
export function useGetIntivationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntivationsQuery, GetIntivationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntivationsQuery, GetIntivationsQueryVariables>(GetIntivationsDocument, options);
        }
export type GetIntivationsQueryHookResult = ReturnType<typeof useGetIntivationsQuery>;
export type GetIntivationsLazyQueryHookResult = ReturnType<typeof useGetIntivationsLazyQuery>;
export type GetIntivationsQueryResult = Apollo.QueryResult<GetIntivationsQuery, GetIntivationsQueryVariables>;
export const IsMemberRequestExistsDocument = gql`
    query IsMemberRequestExists($circleId: Int!) {
  isMemberRequestExists(circleId: $circleId)
}
    `;

/**
 * __useIsMemberRequestExistsQuery__
 *
 * To run a query within a React component, call `useIsMemberRequestExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsMemberRequestExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsMemberRequestExistsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useIsMemberRequestExistsQuery(baseOptions: Apollo.QueryHookOptions<IsMemberRequestExistsQuery, IsMemberRequestExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsMemberRequestExistsQuery, IsMemberRequestExistsQueryVariables>(IsMemberRequestExistsDocument, options);
      }
export function useIsMemberRequestExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsMemberRequestExistsQuery, IsMemberRequestExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsMemberRequestExistsQuery, IsMemberRequestExistsQueryVariables>(IsMemberRequestExistsDocument, options);
        }
export type IsMemberRequestExistsQueryHookResult = ReturnType<typeof useIsMemberRequestExistsQuery>;
export type IsMemberRequestExistsLazyQueryHookResult = ReturnType<typeof useIsMemberRequestExistsLazyQuery>;
export type IsMemberRequestExistsQueryResult = Apollo.QueryResult<IsMemberRequestExistsQuery, IsMemberRequestExistsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MemberRequestsDocument = gql`
    query MemberRequests($circleId: Int!, $cursor: String) {
  memberRequests(circleId: $circleId, cursor: $cursor) {
    hasMore
    data {
      userId
      circleId
      user {
        id
        username
      }
      createdAt
    }
  }
}
    `;

/**
 * __useMemberRequestsQuery__
 *
 * To run a query within a React component, call `useMemberRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberRequestsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMemberRequestsQuery(baseOptions: Apollo.QueryHookOptions<MemberRequestsQuery, MemberRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberRequestsQuery, MemberRequestsQueryVariables>(MemberRequestsDocument, options);
      }
export function useMemberRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberRequestsQuery, MemberRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberRequestsQuery, MemberRequestsQueryVariables>(MemberRequestsDocument, options);
        }
export type MemberRequestsQueryHookResult = ReturnType<typeof useMemberRequestsQuery>;
export type MemberRequestsLazyQueryHookResult = ReturnType<typeof useMemberRequestsLazyQuery>;
export type MemberRequestsQueryResult = Apollo.QueryResult<MemberRequestsQuery, MemberRequestsQueryVariables>;
export const MembersDocument = gql`
    query Members($circleId: Int!, $cursor: String) {
  members(circleId: $circleId, cursor: $cursor) {
    hasMore
    data {
      userId
      isAdmin
      createdAt
      user {
        username
      }
    }
  }
}
    `;

/**
 * __useMembersQuery__
 *
 * To run a query within a React component, call `useMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMembersQuery(baseOptions: Apollo.QueryHookOptions<MembersQuery, MembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MembersQuery, MembersQueryVariables>(MembersDocument, options);
      }
export function useMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MembersQuery, MembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MembersQuery, MembersQueryVariables>(MembersDocument, options);
        }
export type MembersQueryHookResult = ReturnType<typeof useMembersQuery>;
export type MembersLazyQueryHookResult = ReturnType<typeof useMembersLazyQuery>;
export type MembersQueryResult = Apollo.QueryResult<MembersQuery, MembersQueryVariables>;
export const MessagesDocument = gql`
    query Messages($circleId: Int!, $cursor: String) {
  messages(circleId: $circleId, cursor: $cursor) {
    hasMore
    data {
      id
      text
      authorId
      author {
        id
        username
      }
      circleId
      createdAt
    }
  }
}
    `;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const MyCirclesDocument = gql`
    query MyCircles($cursor: String) {
  myCircles(cursor: $cursor) {
    hasMore
    data {
      id
      name
      isAdmin
      updatedAt
      isPublic
    }
  }
}
    `;

/**
 * __useMyCirclesQuery__
 *
 * To run a query within a React component, call `useMyCirclesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCirclesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCirclesQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMyCirclesQuery(baseOptions?: Apollo.QueryHookOptions<MyCirclesQuery, MyCirclesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCirclesQuery, MyCirclesQueryVariables>(MyCirclesDocument, options);
      }
export function useMyCirclesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCirclesQuery, MyCirclesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCirclesQuery, MyCirclesQueryVariables>(MyCirclesDocument, options);
        }
export type MyCirclesQueryHookResult = ReturnType<typeof useMyCirclesQuery>;
export type MyCirclesLazyQueryHookResult = ReturnType<typeof useMyCirclesLazyQuery>;
export type MyCirclesQueryResult = Apollo.QueryResult<MyCirclesQuery, MyCirclesQueryVariables>;
export const MyPostsDocument = gql`
    query MyPosts($circleId: Int!, $cursor: String) {
  myPosts(circleId: $circleId, cursor: $cursor) {
    hasMore
    data {
      id
      circleId
      createdAt
      likesCount
      hasLiked
      imageUrl
      text
    }
  }
}
    `;

/**
 * __useMyPostsQuery__
 *
 * To run a query within a React component, call `useMyPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyPostsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMyPostsQuery(baseOptions: Apollo.QueryHookOptions<MyPostsQuery, MyPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyPostsQuery, MyPostsQueryVariables>(MyPostsDocument, options);
      }
export function useMyPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyPostsQuery, MyPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyPostsQuery, MyPostsQueryVariables>(MyPostsDocument, options);
        }
export type MyPostsQueryHookResult = ReturnType<typeof useMyPostsQuery>;
export type MyPostsLazyQueryHookResult = ReturnType<typeof useMyPostsLazyQuery>;
export type MyPostsQueryResult = Apollo.QueryResult<MyPostsQuery, MyPostsQueryVariables>;
export const PostsDocument = gql`
    query Posts($circleId: Int!, $cursor: String) {
  posts(circleId: $circleId, cursor: $cursor) {
    hasMore
    data {
      id
      creatorId
      createdAt
      likesCount
      hasLiked
      imageUrl
      text
      creator {
        id
        username
      }
    }
  }
}
    `;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsQuery(baseOptions: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const SearchCircleDocument = gql`
    query SearchCircle($query: String!, $cursor: String) {
  searchCircle(query: $query, cursor: $cursor) {
    hasMore
    data {
      id
      name
      totalMembers
      isPublic
      updatedAt
      creator {
        username
      }
    }
  }
}
    `;

/**
 * __useSearchCircleQuery__
 *
 * To run a query within a React component, call `useSearchCircleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCircleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCircleQuery({
 *   variables: {
 *      query: // value for 'query'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useSearchCircleQuery(baseOptions: Apollo.QueryHookOptions<SearchCircleQuery, SearchCircleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCircleQuery, SearchCircleQueryVariables>(SearchCircleDocument, options);
      }
export function useSearchCircleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCircleQuery, SearchCircleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCircleQuery, SearchCircleQueryVariables>(SearchCircleDocument, options);
        }
export type SearchCircleQueryHookResult = ReturnType<typeof useSearchCircleQuery>;
export type SearchCircleLazyQueryHookResult = ReturnType<typeof useSearchCircleLazyQuery>;
export type SearchCircleQueryResult = Apollo.QueryResult<SearchCircleQuery, SearchCircleQueryVariables>;
export const SentInvitaionsDocument = gql`
    query SentInvitaions($circleId: Int!) {
  getSentInvitationOfCircle(circleId: $circleId) {
    senderId
    recipientId
    circleId
    createdAt
    recipient {
      id
      username
    }
  }
}
    `;

/**
 * __useSentInvitaionsQuery__
 *
 * To run a query within a React component, call `useSentInvitaionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSentInvitaionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSentInvitaionsQuery({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useSentInvitaionsQuery(baseOptions: Apollo.QueryHookOptions<SentInvitaionsQuery, SentInvitaionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SentInvitaionsQuery, SentInvitaionsQueryVariables>(SentInvitaionsDocument, options);
      }
export function useSentInvitaionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SentInvitaionsQuery, SentInvitaionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SentInvitaionsQuery, SentInvitaionsQueryVariables>(SentInvitaionsDocument, options);
        }
export type SentInvitaionsQueryHookResult = ReturnType<typeof useSentInvitaionsQuery>;
export type SentInvitaionsLazyQueryHookResult = ReturnType<typeof useSentInvitaionsLazyQuery>;
export type SentInvitaionsQueryResult = Apollo.QueryResult<SentInvitaionsQuery, SentInvitaionsQueryVariables>;
export const NewMessageDocument = gql`
    subscription NewMessage($circleId: Int!) {
  newMessage(circleId: $circleId) {
    id
    circleId
    text
    authorId
    author {
      id
      username
    }
    createdAt
  }
}
    `;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *      circleId: // value for 'circleId'
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, options);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = Apollo.SubscriptionResult<NewMessageSubscription>;