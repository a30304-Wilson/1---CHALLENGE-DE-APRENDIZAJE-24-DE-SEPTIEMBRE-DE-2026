# EVIDENCIA

´´´
48  git init
49  clear
50  git add .
51  git commit -m "Primer commit"
52  clear
53  git branch -M main
54  clear
55  git remote add origin https://github.com/a30304-Wilson/1---CHALLENGE-DE-APRENDIZAJE-24-DE-SEPTIEMBRE-DE-2026.git
56  git push -u origin main
63  aws s3 ls
64  aws sts get-callet-identity --region us-east-1
65  aws sts get-caller-identity --region us-east-1
66  clear
67  terraform init
68  terraform apply
69  clear
70  aws s3 ls
71  clear
72  aws s3 ls
73  aws s3 website s3://web-estatica-challenge1-wilson/ --index-document index.html
74  clear
75  aws s3api put-public-access-block --bucket web-estatica-challenge1-wilson --public-access-block-configuration
76  aws s3api put-public-access-block --bucket web-estatica-challenge1-wilson --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
77  cat <<EOF > policy.json
{
"Version": "2012-10-17",
"Statement": [
    {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::nombre-de-tu-bucket-unico/*"
    }
]
}
EOF

78  aws s3api put-bucket-policy     --bucket nombre-de-tu-bucket-unico     --policy file://policy.json
79  aws s3api put-bucket-policy     --bucket web-estatica-challenge1-wilson     --policy file://policy.json
80  aws s3api put-bucket-policy --bucket web-estatica-challenge1-wilson --policy file://policy.json
81  aws s3api put-bucket-policy --bucket web-estatica-challenge1-wilson --policy file://policy.json
82  aws s3 sync . s3:web-estatica-challenge1-wilson/
83  aws s3 sync . s3://nombre-de-tu-bucket-unico/
84  aws s3 sync . s3://web-estatica-challenge1-wilson/
85  history
´´´