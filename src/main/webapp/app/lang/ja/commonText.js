export default {
  textRequire: "必須",
  errorRequire: "入力は必須となります。",
  errorMaxlength: "文字以内で入力してください。",
  buttonLoadmore: "もっとみる",
  buttonCancel: "キャンセル",
  cognito: {
    MFAMethodNotFoundException: "多要素認証 (MFA) を見つけることができませんでした",
    MalformingPolicyDocumentException: "ポリシー ドキュメントの形式が正しくないため、要求は拒否されました",
    AliasExistsException:
      "この電子メール アドレスまたは電話番号を持つアカウントは、電子メール アドレスまたは電話番号をログイン エイリアスとして使用するように構成したユーザー グループに既に存在します。",
    CodeDeliveryFailureException: "検証コードの配信に失敗しました",
    CodeMismatchException: "認証コードが間違っているか、期限切れです。",
    ConcurrentModificationException: "2 つ以上の変更が同時に発生しました。",
    DuplicateProviderException: "プロバイダーは、ユーザー プールによって既にサポートされています。",
    EnableSoftwareTokenMFAException:
      "コードが一致せず、サービスがソフトウェア トークンの TOTP 最大構成要素 (MFA) 認証を構成できませんでした。",
    ExpiredCodeException: "コードの有効期限が切れているか、コードが正しくありません。",
    ExpiredTokenException: "送信された Web ID が制限されているか無効です。",
    ForbiddenException: "WAF は、ユーザー グループに関連付けられた Web ベースの ACL へのリクエストを許可しません。",
    GroupExistsException: "ユーザー グループに既に存在するグループを検出しました。",
    IDPCommunicationErrorException:
      "受信トークンを確認するために要求された ID プロバイダー (IDP) に到達できなかったため、要求を実行できませんでした。",
    IDPRejectedClaimException: "ID プロバイダー (IdP) は、認証が失敗したことを報告しました。",
    InternalErrorException: "内部エラーが発生しました。",
    InvalidAuthorizationMessageException: "DecodeAuthorizationMessage に無効なメッセージが渡されました",
    InvalidEmailRoleAccessPolicyException: "Eメール ID の使用を許可されていません",
    InvalidIdentityTokenException:
      "渡された Web フォーマット取得トークンをアマゾン ウェブ サービスで検証できませんでした。取得フォーマット プロバイダーから新しいフォーマット取得トークンを取得してから、リクエストを再試行してください。",
    InvalidLambdaResponseException: "無効なレスポンス。",
    InvalidOAuthFlowException: "OAuth フローが無効として定義されています。",
    InvalidParameterException: "サービスで無効なパラメータが検出されました。",
    InvalidPasswordException: "パスワード エラーが発生しました。",
    InvalidRequestException: "必要なパラメーターが欠落しているか、範囲外である可能性があります。",
    InvalidSmsRoleAccessPolicyException:
      "SMS 設定用に提供されたゲーム ロールには、Amazon SNS を使用して公開する権限がありません。",
    InvalidSmsRoleTrustRelationshipException: "SMS 構成に提供されたロールの信頼関係が無効です",
    InvalidUserPoolConfigurationException: "無効なユーザー プール構成です。",
    LimitExceededException: "試行制限を超えました。しばらくしてから試行してください。",
    NotAuthorizedException: "入力されたメールアドレス、またはパスワードが間違っております。再度ご確認ください",
    PackedPolicyTooLargeException:
      "結合されたポリシー インスタンスとタグ インスタンスの合計パッキング サイズが大きすぎるため、要求は拒否されました。",
    PasswordResetRequiredException: "パスワードのリセットが必要です。",
    PreconditionNotMetException: "前提条件が回答されていません。",
    RegionDisabledException:
      "資格情報の生成を求められているアカウントに対して、要求されたリージョンで STS が有効になっていません。",
    ResourceNotFoundException: "指定されたリソースのみが存在しません。",
    ScopeDoesNotExistException: "スコープが存在しないと定義されています。",
    SoftwareTokenMFANotFoundException:
      "ソフトウェア トークンの時間ベースの多要素認証 (MFA) (TOTP) がユーザー グループに対して有効になっていません。",
    TooManyFailedAttemptsException:
      "ユーザーが事前定義されたアクション (ログインなどの制限など) に対して実行した試行の失敗回数が多すぎます。",
    UnauthorizedException: "リクエストが承認されていません。",
    UnexpectedLambdaException: "予期しない例外が発生しました。",
    UnsupportedIdentityProviderException: "フォーマットされた識別子はサポートされていません。",
    UnsupportedOperationException: "アプリケーション プール クライアント ユーザーに対して操作が有効になっていません。",
    UnsupportedTokenTypeException: "メッセージ コードがアクティブへの使用をサポートしていません。",
    UnsupportedUserStateException: "ユーザーがサポートされていない状態にあったため、要求は失敗しました。",
    UserImportInProgressException:
      "ユーザー インポート作業がそのグループで進行中に、エラーがユーザー グループを変更しようとしました。",
    UserLambdaValidationException: "サービスでユーザー認証例外が発生しました。",
    UserNotConfirmedException:
      "会員の登録が完了していません。「有効化メールを再送信」をクリックして会員登録を行ってください。",
    UserNotFoundException: "ユーザーが存在しません",
    UserPoolAddOnNotEnabledException: "ユーザー プール アドオンが有効になっていません。",
    UserPoolTaggingException: "ユーザーグループ タグを設定または更新できませんでした。",
    UsernameExistsException: "指定された電子メールのアカウントは既に存在します。",
    maxError:
      "一定回数以上ログインに失敗したため、一時的にアカウントがロックされました。お時間をおいて、再度お試しください",
  },
  cognitoChangePassword: {
    NotAuthorizedException: "パスワードが一致しません。",
  },
  cognitoLogout: {
    NotAuthorizedException: "アクセストークンが取り消されました。",
  },
  changePasswordSuccess: "パスワードの変更は成功になりました。",
  titlePage: {
    login: "ログイン",
    changePassword: "パスワード変更",
    eventList: "イベント一覧",
    memberList: "会員一覧",
    memberDetail: "会員詳細",
    smsAuthen: "SMS認証",
  },
  userName: "管理者名が入ります",
};
