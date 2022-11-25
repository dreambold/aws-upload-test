# Problem

Upload via aws-sdk (not drag and drop to S3 on the website), breaks static website hosting

## My Environment

Mac OS Version 12.3.1, Node JS 14.20.1

## Before Testing

Change to your AWS key and bucket name on .env

## Step to reproduce the problem

1. Create AWS S3 Bucket
2. Uncheck Block all public access
3. Check I acknowledge that the current settings might result in this bucket and the objects within becoming public.
4. Press Create bucket
5. Click the newly created bucket
6. Switch to Properties Tab
7. Edit Static website hosting
8. Enable Static website hosting / Hosting type Host a static website / Index document: index.html / Error document: index.html
9. Click Save changes
10. Switch To Permissions Tab
11. Edit Bucket policy
12. Place the following to the policy, remember to change [Bucket ARN] to the one above

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "[Bucket ARN]/*"
        }
    ]
}
```

13. Click Save changes
14. On this project, run

```bash
npm i
npm run build
```

15. Place the content of the out directory in to AWS Objects Tab
16. Test if you can access the home page via the link on Properties > Static website hosting > Bucket website endpoint
17. Whatever you type [websiteLink]/XXXX. You should still redirect to home page
18. On this project, run

```bash
npm run deploy
```

19. Access the website link agian.
20. If you type anything after the website link. It will say This site can’t be reached. If you type in index.html, it will download the file instead of opening it.
