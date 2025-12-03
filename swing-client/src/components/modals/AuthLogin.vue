<template>
    <div class="loginmodal" v-auto-animate>
        <div class="content">
            <section class="left">
                <header class="left-header">
                    <h1 class="title">Welcome</h1>
                    <p class="subtitle">Sign in to continue your journey with Aristo.</p>
                </header>

                <form class="form" @submit.prevent="loginUser">
                    <label class="field">
                        <span class="label">Username</span>
                        <div class="input-shell">
                            <input
                                v-model="username"
                                type="text"
                                autocomplete="off"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </label>
                    <label class="field">
                        <span class="label">Password</span>
                        <div class="input-shell">
                            <input
                                v-model="password"
                                type="password"
                                autocomplete="current-password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </label>

                    <button class="primary" type="submit" :disabled="!password || loading">
                        <span v-if="!loading">Sign in</span>
                        <span v-else>Signing in…</span>
                    </button>
                </form>

                <button v-if="guestAllowed" class="guest" type="button" @click="() => guestLogin()">
                    Continue as guest
                </button>
            </section>

            <section class="right">
                <div class="hero"></div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, computed, nextTick, onMounted, ref } from 'vue'

import { UserSimplified } from '@/interfaces'
import { getAllUsers } from '@/requests/auth'
import useAuth from '@/stores/auth'

import ArrowSvg from '../../assets/icons/expand.svg'
import Logo from '../Logo.vue'
import Input from '../shared/Input.vue'
import User from '../shared/LoginUserCard.vue'

const auth = useAuth()

const username = ref('') // left intentionally blank so browser autofill can suggest but we do not prefill
const password = ref('')
const loading = ref(false)

const users: Ref<UserSimplified[]> = ref([])
const shownUsers = computed(() => users.value.filter(user => user.username !== 'guest'))
const selected = ref<UserSimplified | null>(null)

const guestAllowed = computed(() => users.value.some(user => user.username === 'guest'))

async function setUser(user: UserSimplified) {
    selected.value = user
    username.value = ''

    await nextTick()
    if (user.username === '') {
        document.getElementById('loginuserinput')?.focus()
    } else {
        document.getElementById('loginpassinput')?.focus()
    }
}

function resetSelected() {
    selected.value = null
}

async function loginUser() {
    if (!password.value || loading.value) {
        return
    }

    loading.value = true
    try {
        await auth.login(username.value, password.value)
    } finally {
        loading.value = false
    }
}

async function guestLogin(usernameArg: string = 'guest', passwordArg: string = 'guest') {
    await auth.login(usernameArg, passwordArg)
}

onMounted(async () => {
    let res = await getAllUsers()

    if (res.users.length === 0 || (res.users.length == 1 && res.users[0].username === 'guest')) {
        setUser({ id: 0, username: '', firstname: '' })
    }

    if (res.users.filter(user => user.username !== 'guest').length === 1) {
        setTimeout(() => {
            setUser(res.users[0])
        }, 250)
    }

    users.value = res.users
})
</script>

<style lang="scss">
    .loginmodal {
    border-radius: 1.5rem;
    border: 1px solid #262626;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);

    width: 58rem;
    max-width: calc(100vw - 2rem);
    height: 32rem;
    max-height: calc(100vh - 4rem);
    display: grid;
    grid-template-rows: 1fr;
    background: #050505;

    @include allPhones {
        max-width: calc(100vw - 2rem);
        width: 100%;
    }

    .head {
        padding: 1rem 1.25rem;
        border-bottom: solid 1px $gray5;
        display: flex;
        justify-content: center;
        align-items: center;
    }

     .content {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
        gap: 1.25rem;
        padding: 1.5rem 1.5rem 1.75rem;
        height: 100%;

        @include allPhones {
            grid-template-columns: 1fr;
        }
    }

    @include allPhones {
        .right {
            display: none !important;
        }

        .content {
            grid-template-columns: 1fr;
        }
    }


    .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1.75rem;
    }

    .left-header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .title {
            margin: 0;
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: -0.04em;
        }

        .subtitle {
            margin: 0;
            color: $gray2;
            font-size: 0.9rem;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: $gray2;
        }

        .input-shell {
            border-radius: 0.9rem;
            border: 1px solid #262626;
            background: #050505;
            padding: 0.2rem 0.25rem;
            transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;

            input {
                width: 100%;
                border: none;
                outline: none;
                background: transparent;
                color: $white;
                padding: 0.8rem 0.9rem;
                font-size: 0.95rem;

                &::placeholder {
                    color: #737373;
                }
            }

            &:focus-within {
                border-color: #ffffff;
                box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
                background: #000000;
            }
        }
    }

    .primary {
        margin-top: 1.4rem;
        border: none;
        border-radius: 999px;
        padding: 0.95rem 1.1rem;
        font-size: 0.95rem;
        font-weight: 600;
        background: #ffffff;
        color: #050505;
        cursor: pointer;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s ease, background 0.15s ease, color 0.15s ease;

        &:hover:enabled {
            transform: translateY(-1px);
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.55);
            background: #e5e5e5;
        }

        &:active:enabled {
            transform: translateY(0);
            box-shadow: none;
        }

        &:disabled {
            opacity: 0.6;
            cursor: default;
        }
    }

    .guest {
        margin-top: 0.75rem;
        border: none;
        background: none;
        color: $gray2;
        font-size: 0.85rem;
        text-decoration: underline;
        cursor: pointer;
    }

    .right {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hero {
        width: 100%;
        height: 100%;
        border-radius: 1.5rem;
        overflow: hidden;
        background-image: url('/Aristo-billboard-2.png');
        background-size: cover;
        background-position: center;
        filter: grayscale(100%) contrast(1.1);
        background-color: transparent;
    }
}
</style>
