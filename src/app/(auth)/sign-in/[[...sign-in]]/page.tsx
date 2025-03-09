import { SignIn } from '@clerk/nextjs';

function SignInPage() {
  return <SignIn initialValues={{ emailAddress: 'anurag@example.com' }} />;
}

export default SignInPage;
